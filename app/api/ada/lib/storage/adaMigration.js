// @flow

// Handle migration to newer versions of Yoroi

import {
  reset,
  getAddressesList
} from './lovefieldDatabase';
import {
  saveLastReceiveAddressIndex,
} from './adaLocalStorage';
import LocalStorageApi from '../../../localStorage/index';
import {
  Logger,
} from '../../../../utils/logging';
import {
  satisfies,
} from 'semver';
import {
  OPEN_TAB_ID_KEY,
} from '../../../../utils/tabManager';

export async function migrateToLatest(
  localStorageApi: LocalStorageApi
): Promise<boolean> {
  let lastLaunchVersion = await localStorageApi.getLastLaunchVersion();
  Logger.info(`Starting migration for ${lastLaunchVersion}`);
  /**
   * Note: Although we don't start migration if the user is running a fresh installation
   * We still cannot be certain any key exists in localstorage
   *
   * For example, somebody may have downloaded Yoroi a long time ago
   * but only completed the language select before closing the application
   *
   * Therefore, you need to always check that data exists before migrating it
   */

  /**
    * Note: Be careful about the kinds of migrations you do here.
    * You are essentially swapping the app state under the hood
    * Therefore mobx may not notice the change as expected
    */

  const migrationMap: Array<[string, () => Promise<boolean>]> = [
    ['=0.0.1', async () => await testMigration(localStorageApi)],
    /**
     * We changed the place where Yoroi data is stored so  we must process this migration first
     * to ensure other migrations look at the right place for storage
     */
    ['<1.9.0', async () => {
      const applied = await moveStorage(localStorageApi);
      if (applied) {
        // update last launch version to what's in the new storage location
        lastLaunchVersion = await localStorageApi.getLastLaunchVersion();
      }
      return applied;
    }],
    ['<1.4.0', bip44Migration],
  ];

  let appliedMigration = false;
  for (const entry of migrationMap) {
    if (satisfies(lastLaunchVersion, entry[0])) {
      Logger.info(`Migration started for ${entry[0]}`);
      const applied = await entry[1]();
      if (applied) {
        Logger.info(`Applied migration for ${entry[0]}`);
      }
      appliedMigration = appliedMigration || applied;
    }
  }

  return appliedMigration;
}

/**
 * We use this as a dummy migration so that our tests can verify migration is working correctly
 */
async function testMigration(localStorageApi: LocalStorageApi): Promise<boolean> {
  // changing the locale is something we can easily detect from our tests
  Logger.info(`Starting testMigration`);
  // Note: mobx will not notice this change until you refresh
  await localStorageApi.setUserLocale('ja-JP');
  return true;
}

/**
 * Previous version of Yoroi used window.localStorage
 * since version 1.9 this storage needs to be moved to storage.local.
 * This function must go before other modifications because they will work over storage.local.
 */
async function moveStorage(localStorageApi: LocalStorageApi): Promise<boolean> {
  // Note: this function assumes nobody is using Yoroi as a  website (at least before 1.9.0)
  const oldStorage = await localStorageApi.getOldStorage();
  if (oldStorage.length === 0) {
    return false;
  }
  if (oldStorage.length === 1 && oldStorage[OPEN_TAB_ID_KEY] != null) {
    // old storage may contain just the tab id
    // since this field is re-generated every time the app launches in the right storage
    // we can just clear it
    oldStorage.clear();
    return false;
  }
  await localStorageApi.setStorage(oldStorage);
  oldStorage.clear();
  return true;
}

/**
 * Previous version of Yoroi were not BIP44 compliant
 * Notably, it didnt scan 20 addresses ahead of the last used address.
 * This causes desyncs when you use Yoroi either on multiple computers with the same wallet
 * or you use the same wallet on Chrome + mobile.
 */
async function bip44Migration(): Promise<boolean> {
  Logger.info(`Starting bip44Migration`);
  const addresses = await getAddressesList();
  if (!addresses || addresses.length === 0) {
    return false;
  }
  /**
   * We used to consider all addresses in the DB as explicitly generated by the user
   * However, BIP44 requires us to also store 20 addresses after the last used address
   * Therefore the highest index in the old format is the heightest generated for new format
   */
  const maxIndex = Math.max(
    ...addresses
      .filter(address => address.change === 0)
      .map(address => address.index),
    0
  );

  // if we had more than one address, then the WALLET key must exist in localstorage
  await saveLastReceiveAddressIndex(maxIndex);

  /**
   * Once we've saved the receive address, we dump the DB entirely
   * We need to do this since old wallets may have incorrect history
   * Due to desync issue caused by the incorrect bip44 implementation
   */
  await reset();

  return true;
}
