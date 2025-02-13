
// @flow
import '../lib/test-config';
import { schema } from 'lovefield';
import type { UTXO, AdaAddress } from '../adaTypes';
import {
  newAdaUnsignedTx,
  newAdaUnsignedTxFromUtxo,
  sendAllUnsignedTxFromUtxo,
  signTransaction
} from './adaNewTransactions';
import {
  NotEnoughMoneyToSendError,
} from '../errors';

import {
  loadLovefieldDB,
} from '../lib/storage/lovefieldDatabase';

import { RustModule } from '../lib/cardanoCrypto/rustLoader';

import type { AddressUtxoFunc } from '../lib/state-fetch/types';

// function to mock our network call
function makeNetworkMock(utxos): AddressUtxoFunc {
  return async (body) => {
    const senderUtxos = [];
    for (const addr of body.addresses) {
      for (const utxo of utxos) {
        if (utxo.receiver === addr) {
          senderUtxos.push(utxo);
        }
      }
    }
    return senderUtxos;
  };
}

const sampleUtxos: Array<UTXO> = [
  {
    amount: '7001',
    receiver: 'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
    tx_hash: '05ec4a4a7f4645fa66886cef2e34706907a3a7f9d88e0d48b313ad2cdf76fb5f',
    tx_index: 0,
    utxo_id: '05ec4a4a7f4645fa66886cef2e34706907a3a7f9d88e0d48b313ad2cdf76fb5f0',
  },
  {
    amount: '1000001',
    receiver: 'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
    tx_hash: '6930f123df83e4178b0324ae617b2028c0b38c6ff4660583a2abf1f7b08195fe',
    tx_index: 0,
    utxo_id: '6930f123df83e4178b0324ae617b2028c0b38c6ff4660583a2abf1f7b08195fe0',
  },
  {
    amount: '10000001',
    receiver: 'Ae2tdPwUPEZ4xAL3nxLq4Py7BfS1D2tJ3u2rxZGnrAXC8TNkWhTaz41J3FN',
    tx_hash: '0df0273e382739f8b4ae3783d81168093e78e0b48ec2c5430ff03d444806a173',
    tx_index: 0,
    utxo_id: '0df0273e382739f8b4ae3783d81168093e78e0b48ec2c5430ff03d444806a1730',
  },
];

const sampleAdaAddresses: Array<AdaAddress> = [
  {
    cadAmount: { getCCoin: '0' },
    cadId: 'Ae2tdPwUPEZEtwz7LKtJn9ub8y7ireuj3sq2yUCZ57ccj6ZkJKn7xEiApV9',
    cadIsUsed: false,
    account: 0,
    change: 1,
    index: 11,
  },
  {
    cadAmount: { getCCoin: '0' },
    cadId: 'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
    cadIsUsed: false,
    account: 0,
    change: 0,
    index: 135,
  },
];

beforeAll(async () => {
  await RustModule.load();
  await loadLovefieldDB({
    storeType: schema.DataStoreType.MEMORY,
  });
});

describe('Create unsigned TX from UTXO', () => {
  it('Should create a valid transaction withhout selection', async () => {
    const utxos: Array<UTXO> = [sampleUtxos[1]];
    const unsignedTxResponse = await newAdaUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '5001', // smaller than input
      [],
      utxos
    );
    expect(unsignedTxResponse.senderUtxos).toEqual(utxos);
    expect(unsignedTxResponse.txBuilder.get_input_total().to_str()).toEqual('1.000001');
    expect(unsignedTxResponse.txBuilder.get_output_total().to_str()).toEqual('0.005001');
    expect(unsignedTxResponse.txBuilder.estimate_fee(
      RustModule.Wallet.LinearFeeAlgorithm.default()
    ).to_str()).toEqual('0.165753');
    // burns remaining amount
    expect(unsignedTxResponse.txBuilder.get_balance_without_fees().value().to_str()).toEqual('0.995000');
  });

  it('Should fail due to insufficient funds (bigger than all inputs)', async () => {
    const utxos: Array<UTXO> = [sampleUtxos[1]];
    expect(newAdaUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '1900001', // bigger than input including fees
      [],
      utxos
    )).rejects.toThrow(NotEnoughMoneyToSendError);
  });

  it('Should fail due to insufficient funds (no inputs)', async () => {
    expect(newAdaUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '1', // bigger than input including fees
      [],
      [],
    )).rejects.toThrow(NotEnoughMoneyToSendError);
  });

  it('Should fail due to insufficient funds (not enough to cover fees)', async () => {
    const utxos: Array<UTXO> = [sampleUtxos[0]];
    expect(newAdaUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '1', // bigger than input including fees
      [],
      utxos,
    )).rejects.toThrow(NotEnoughMoneyToSendError);
  });

  it('Should pick inputs when using input selection', async () => {
    const utxos: Array<UTXO> = sampleUtxos;
    const unsignedTxResponse = await newAdaUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '1001', // smaller than input
      [sampleAdaAddresses[0]],
      utxos
    );
    // input selection will only take 2 of the 3 inputs
    // it takes 2 inputs because input selection algorithm
    expect(unsignedTxResponse.senderUtxos).toEqual([utxos[0], utxos[1]]);
    expect(unsignedTxResponse.txBuilder.get_input_total().to_str()).toEqual('1.007002');
    expect(unsignedTxResponse.txBuilder.get_output_total().to_str()).toEqual('0.831142');
    expect(unsignedTxResponse.txBuilder.estimate_fee(
      RustModule.Wallet.LinearFeeAlgorithm.default()
    ).to_str()).toEqual('0.175860');
  });
});


describe('Create unsigned TX from addresses', () => {
  it('Should create a valid transaction withhout selection', async () => {
    const utxos: Array<UTXO> = sampleUtxos;
    const unsignedTxResponse = await newAdaUnsignedTx(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '5001', // smaller than input
      [],
      [sampleAdaAddresses[1]],
      makeNetworkMock(utxos),
    );
    expect(unsignedTxResponse.senderUtxos).toEqual([utxos[0], utxos[1]]);
    expect(unsignedTxResponse.txBuilder.get_input_total().to_str()).toEqual('1.007002');
    expect(unsignedTxResponse.txBuilder.get_output_total().to_str()).toEqual('0.005001');
    expect(unsignedTxResponse.txBuilder.estimate_fee(
      RustModule.Wallet.LinearFeeAlgorithm.default()
    ).to_str()).toEqual('0.173707');
    // burns remaining amount
    expect(unsignedTxResponse.txBuilder.get_balance_without_fees().value().to_str()).toEqual('1.002001');
  });
});

describe('Create signed transactions', () => {
  it('Witness should match on valid private key', async () => {
    const utxos: Array<UTXO> = sampleUtxos;
    const unsignedTxResponse = await newAdaUnsignedTx(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      '5001', // smaller than input
      [],
      [sampleAdaAddresses[1]],
      makeNetworkMock(utxos),
    );
    const signRequest = {
      addressesMap: unsignedTxResponse.addressesMap,
      changeAddr: unsignedTxResponse.changeAddr,
      senderUtxos: unsignedTxResponse.senderUtxos,
      unsignedTx: unsignedTxResponse.txBuilder.make_transaction(),
    };

    const accountPrivateKey = RustModule.Wallet.Bip44AccountPrivate.new(
      RustModule.Wallet.PrivateKey.from_hex(
        '70afd5ff1f7f551c481b7e3f3541f7c63f5f6bcb293af92565af3deea0bcd6481a6e7b8acbe38f3906c63ccbe8b2d9b876572651ac5d2afc0aca284d9412bb1b4839bf02e1d990056d0f06af22ce4bcca52ac00f1074324aab96bbaaaccf290d'
      ),
      RustModule.Wallet.DerivationScheme.v2()
    );
    const signedTx = signTransaction(
      signRequest,
      accountPrivateKey
    );
    const witnesses = signedTx.to_json().witness;

    const witOne = witnesses[0].PkWitness;
    const witTwo = witnesses[1].PkWitness;

    expect(witOne).toEqual([
      '8fb03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbfd8800b51c02623fceb96b07408531a5cb259f53845a38d6b68928e7c0c7e390f07545d0e62',
      '3cbaf97c2e805c1b0b2953a7e0671b681527251c486676ba20379ab3eddf53c16769c8fb5a41d41a442e67e7725219ad5fb90b239b8a82337dc2904863e7be04'
    ]);
    expect(witTwo).toEqual([
      '8fb03c3aa052f51c086c54bd4059ead2d2e426ac89fa4b3ce41cbfd8800b51c02623fceb96b07408531a5cb259f53845a38d6b68928e7c0c7e390f07545d0e62',
      '3cbaf97c2e805c1b0b2953a7e0671b681527251c486676ba20379ab3eddf53c16769c8fb5a41d41a442e67e7725219ad5fb90b239b8a82337dc2904863e7be04'
    ]);
  });
});

describe('Create sendAll unsigned TX from UTXO', () => {
  describe('Create send-all TX from UTXO', () => {
    it('Create a transaction involving all input with no change', async () => {
      const utxos: Array<UTXO> = [sampleUtxos[1], sampleUtxos[2]];
      const sendAllResponse = await sendAllUnsignedTxFromUtxo(
        'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
        utxos,
      );

      expect(sendAllResponse.senderUtxos).toEqual([utxos[0], utxos[1]]);
      expect(sendAllResponse.txBuilder.get_input_total().to_str()).toEqual('11.000002');
      expect(sendAllResponse.txBuilder.get_output_total().to_str()).toEqual('10.826207');
      expect(sendAllResponse.txBuilder.estimate_fee(
        RustModule.Wallet.LinearFeeAlgorithm.default()
      ).to_str()).toEqual('0.173795');
      // make sure we don't accidentally burn a lot of coins
      expect(sendAllResponse.txBuilder.get_balance_without_fees().value().to_str()).toEqual('0.173795');
    });
  });

  it('Should fail due to insufficient funds (no inputs)', async () => {
    expect(sendAllUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      [],
    )).rejects.toThrow(NotEnoughMoneyToSendError);
  });

  it('Should fail due to insufficient funds (not enough to cover fees)', async () => {
    const utxos: Array<UTXO> = [sampleUtxos[0]];
    expect(sendAllUnsignedTxFromUtxo(
      'Ae2tdPwUPEZKX8N2TjzBXLy5qrecnQUniTd2yxE8mWyrh2djNpUkbAtXtP4',
      utxos,
    )).rejects.toThrow(NotEnoughMoneyToSendError);
  });

});
