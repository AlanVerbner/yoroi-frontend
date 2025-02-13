// @flow

import { defineMessages } from 'react-intl';
import LocalizableError from '../../i18n/LocalizableError';

const messages = defineMessages({
  walletAlreadyImportedError: {
    id: 'api.errors.WalletAlreadyImportedError',
    defaultMessage: '!!!Wallet you are trying to import already exists.',
  },
  redeemAdaError: {
    id: 'api.errors.RedeemAdaError',
    defaultMessage: '!!!Your ADA could not be redeemed correctly.',
  },
  walletFileImportError: {
    id: 'api.errors.WalletFileImportError',
    defaultMessage: '!!!Wallet could not be imported, please make sure you are providing a correct file.',
  },
  notEnoughMoneyToSendError: {
    id: 'api.errors.NotEnoughMoneyToSendError',
    defaultMessage: '!!!Not enough money to make this transaction.',
  },
  updateAdaWalletError: {
    id: 'api.errors.updateAdaWalletError',
    defaultMessage: '!!!Error while updating ada wallet.',
  },
  getBalanceError: {
    id: 'api.errors.getBalanceError',
    defaultMessage: '!!!Error while getting Balance.',
  },
  updateAdaTxsHistoryError: {
    id: 'api.errors.updateAdaTxsHistoryError',
    defaultMessage: '!!!Error while updating ada transactions history.',
  },
  transactionError: {
    id: 'api.errors.transactionError',
    defaultMessage: '!!!Error while creating transaction.',
  },
  pendingTransactionError: {
    id: 'api.errors.pendingTransactionError',
    defaultMessage: '!!!Error while updating pending transactions.',
  },
  getAddressesKeysError: {
    id: 'api.errors.getAddressesWithFundsError',
    defaultMessage: '!!!Error while getting addresses with funds.',
  },
  noInputsError: {
    id: 'api.errors.noInputsError',
    defaultMessage: '!!!The wallet restored from your recovery phrase is empty. Please check your recovery phrase and attempt restoration again.',
  },
  generateTransferTxError: {
    id: 'api.errors.generateTransferTxError',
    defaultMessage: '!!!Error while generating transfer transacion.',
  },
  sendTransactionError: {
    id: 'api.errors.sendTransactionError',
    defaultMessage: '!!!Error received from api method call while sending tx.',
  },
  getAllUTXOsForAddressesError: {
    id: 'api.errors.getAllUTXOsForAddressesError',
    defaultMessage: '!!!Error received from api method call while getting utxos.',
  },
  getTxsBodiesForUTXOsError: {
    id: 'api.errors.getTxsBodiesForUTXOsError',
    defaultMessage: '!!!Error received from api method call while getting TxBodies.',
  },
  getTxsBodiesForUTXOsApiError: {
    id: 'api.errors.getTxsBodiesForUTXOsApiError',
    defaultMessage: '!!!Error received from server while getting TxBodies.',
  },
  discoverAddressesError: {
    id: 'api.errors.discoverAddressesError',
    defaultMessage: '!!!Error received from api method call while discovering addresses.',
  },
  getUtxosForAddressesApiError: {
    id: 'api.errors.getUtxosForAddressesApiError',
    defaultMessage: '!!!Error received from server while getting UTXOs.',
  },
  getUtxosSumsForAddressesApiError: {
    id: 'api.errors.getUtxosSumsForAddressesApiError',
    defaultMessage: '!!!Error received from server while getting balance.',
  },
  getTxHistoryForAddressesApiError: {
    id: 'api.errors.getTxHistoryForAddressesApiError',
    defaultMessage: '!!!Error received from server while getting txs.',
  },
  sendTransactionApiError: {
    id: 'api.errors.sendTransactionApiError',
    defaultMessage: '!!!Error received from server while sending tx.',
  },
  checkAdressesInUseApiError: {
    id: 'api.errors.checkAdressesInUseApiError',
    defaultMessage: '!!!Error received from server while checking used addresses.',
  },
  invalidWitnessError: {
    id: 'api.errors.invalidWitnessError',
    defaultMessage: '!!!The signature is invalid.',
  },
  invalidCertificateError: {
    id: 'api.errors.invalidCertificateError',
    defaultMessage: '!!!Invalid certificate.',
  },
  readFileError: {
    id: 'api.errors.readFileError',
    defaultMessage: '!!!Error while reading file.',
  },
  decryptionError: {
    id: 'api.errors.decryptionError',
    defaultMessage: '!!!Error while decrypting file.',
  },
  parsePDFFileError: {
    id: 'api.errors.parsePDFFileError',
    defaultMessage: '!!!Error while parsing PDF file.',
  },
  parsePDFPageError: {
    id: 'api.errors.parsePDFPageError',
    defaultMessage: '!!!Error while parsing PDF file page.',
  },
  parsePDFKeyError: {
    id: 'api.errors.parsePDFKeyError',
    defaultMessage: '!!!Error while parsing secret key.',
  },
  invalidMnemonicError: {
    id: 'api.errors.invalidMnemonicError',
    defaultMessage: '!!!Invalid phrase entered, please check.',
  },
  adaRedemptionEncryptedCertificateParseError: {
    id: 'api.errors.adaRedemptionEncryptedCertificateParseError',
    defaultMessage: '!!!The ADA redemption code could not be parsed, please check your passphrase.',
  },
  adaRedemptionCertificateParseError: {
    id: 'api.errors.adaRedemptionCertificateParseError',
    defaultMessage: '!!!The ADA redemption code could not be parsed from the given document.',
  },
  noCertificateError: {
    id: 'api.errors.noCertificateError',
    defaultMessage: '!!!Certificate File is required for parsing.',
  },
  redemptionKeyAlreadyUsedError: {
    id: 'api.errors.redemptionKeyAlreadyUsedError',
    defaultMessage: '!!!Redemption key has already been used.',
  },
  serverStatusError: {
    id: 'api.errors.serverStatusError',
    defaultMessage: '!!!Connection to the server failed. Please check your internet connection or our Twitter account (https://twitter.com/YoroiWallet).',
  }
});

export class WalletAlreadyImportedError extends LocalizableError {
  constructor() {
    super({
      id: messages.walletAlreadyImportedError.id,
      defaultMessage: messages.walletAlreadyImportedError.defaultMessage || '',
    });
  }
}

export class RedeemAdaError extends LocalizableError {
  constructor() {
    super({
      id: messages.redeemAdaError.id,
      defaultMessage: messages.redeemAdaError.defaultMessage || '',
    });
  }
}

export class WalletFileImportError extends LocalizableError {
  constructor() {
    super({
      id: messages.walletFileImportError.id,
      defaultMessage: messages.walletFileImportError.defaultMessage || '',
    });
  }
}

export class NotEnoughMoneyToSendError extends LocalizableError {
  constructor() {
    super({
      id: messages.notEnoughMoneyToSendError.id,
      defaultMessage: messages.notEnoughMoneyToSendError.defaultMessage || '',
    });
  }
}

export class UpdateAdaWalletError extends LocalizableError {
  constructor() {
    super({
      id: messages.updateAdaWalletError.id,
      defaultMessage: messages.updateAdaWalletError.defaultMessage || '',
    });
  }
}

export class GetBalanceError extends LocalizableError {
  constructor() {
    super({
      id: messages.getBalanceError.id,
      defaultMessage: messages.getBalanceError.defaultMessage || '',
    });
  }
}

export class UpdateAdaTxsHistoryError extends LocalizableError {
  constructor() {
    super({
      id: messages.updateAdaTxsHistoryError.id,
      defaultMessage: messages.updateAdaTxsHistoryError.defaultMessage || '',
    });
  }
}

export class TransactionError extends LocalizableError {
  constructor() {
    super({
      id: messages.transactionError.id,
      defaultMessage: messages.transactionError.defaultMessage || '',
    });
  }
}

export class PendingTransactionError extends LocalizableError {
  constructor() {
    super({
      id: messages.pendingTransactionError.id,
      defaultMessage: messages.pendingTransactionError.defaultMessage || '',
    });
  }
}

export class GetAddressesKeysError extends LocalizableError {
  constructor() {
    super({
      id: messages.getAddressesKeysError.id,
      defaultMessage: messages.getAddressesKeysError.defaultMessage || '',
    });
  }
}

export class NoInputsError extends LocalizableError {
  constructor() {
    super({
      id: messages.noInputsError.id,
      defaultMessage: messages.noInputsError.defaultMessage || '',
    });
  }
}

export class GenerateTransferTxError extends LocalizableError {
  constructor() {
    super({
      id: messages.generateTransferTxError.id,
      defaultMessage: messages.generateTransferTxError.defaultMessage || '',
    });
  }
}

export class SendTransactionError extends LocalizableError {
  constructor() {
    super({
      id: messages.sendTransactionError.id,
      defaultMessage: messages.sendTransactionError.defaultMessage || '',
    });
  }
}

export class GetAllUTXOsForAddressesError extends LocalizableError {
  constructor() {
    super({
      id: messages.getAllUTXOsForAddressesError.id,
      defaultMessage: messages.getAllUTXOsForAddressesError.defaultMessage || '',
    });
  }
}

export class DiscoverAddressesError extends LocalizableError {
  constructor() {
    super({
      id: messages.discoverAddressesError.id,
      defaultMessage: messages.discoverAddressesError.defaultMessage || '',
    });
  }
}

export class GetUtxosForAddressesApiError extends LocalizableError {
  constructor() {
    super({
      id: messages.getUtxosForAddressesApiError.id,
      defaultMessage: messages.getUtxosForAddressesApiError.defaultMessage || '',
    });
  }
}

export class GetTxsBodiesForUTXOsError extends LocalizableError {
  constructor() {
    super({
      id: messages.getTxsBodiesForUTXOsError.id,
      defaultMessage: messages.getTxsBodiesForUTXOsError.defaultMessage || '',
    });
  }
}

export class GetTxsBodiesForUTXOsApiError extends LocalizableError {
  constructor() {
    super({
      id: messages.getTxsBodiesForUTXOsApiError.id,
      defaultMessage: messages.getTxsBodiesForUTXOsApiError.defaultMessage || '',
    });
  }
}

export class GetUtxosSumsForAddressesApiError extends LocalizableError {
  constructor() {
    super({
      id: messages.getUtxosSumsForAddressesApiError.id,
      defaultMessage: messages.getUtxosSumsForAddressesApiError.defaultMessage || '',
    });
  }
}

export class GetTxHistoryForAddressesApiError extends LocalizableError {
  constructor() {
    super({
      id: messages.getTxHistoryForAddressesApiError.id,
      defaultMessage: messages.getTxHistoryForAddressesApiError.defaultMessage || '',
    });
  }
}

export class SendTransactionApiError extends LocalizableError {
  constructor() {
    super({
      id: messages.sendTransactionApiError.id,
      defaultMessage: messages.sendTransactionApiError.defaultMessage || '',
    });
  }
}

export class CheckAdressesInUseApiError extends LocalizableError {
  constructor() {
    super({
      id: messages.checkAdressesInUseApiError.id,
      defaultMessage: messages.checkAdressesInUseApiError.defaultMessage || '',
    });
  }
}

export class InvalidWitnessError extends LocalizableError {
  constructor() {
    super({
      id: messages.invalidWitnessError.id,
      defaultMessage: messages.invalidWitnessError.defaultMessage || '',
    });
  }
}

export class InvalidCertificateError extends LocalizableError {
  constructor() {
    super({
      id: messages.invalidCertificateError.id,
      defaultMessage: messages.invalidCertificateError.defaultMessage || '',
    });
  }
}

export class ReadFileError extends LocalizableError {
  constructor() {
    super({
      id: messages.readFileError.id,
      defaultMessage: messages.readFileError.defaultMessage || '',
    });
  }
}

export class DecryptionError extends LocalizableError {
  constructor() {
    super({
      id: messages.decryptionError.id,
      defaultMessage: messages.decryptionError.defaultMessage || '',
    });
  }
}

export class ParsePDFFileError extends LocalizableError {
  constructor() {
    super({
      id: messages.parsePDFFileError.id,
      defaultMessage: messages.parsePDFFileError.defaultMessage || '',
    });
  }
}

export class ParsePDFPageError extends LocalizableError {
  constructor() {
    super({
      id: messages.parsePDFPageError.id,
      defaultMessage: messages.parsePDFPageError.defaultMessage || '',
    });
  }
}

export class ParsePDFKeyError extends LocalizableError {
  constructor() {
    super({
      id: messages.parsePDFKeyError.id,
      defaultMessage: messages.parsePDFKeyError.defaultMessage || '',
    });
  }
}

export class InvalidMnemonicError extends LocalizableError {
  constructor() {
    super({
      id: messages.invalidMnemonicError.id,
      defaultMessage: messages.invalidMnemonicError.defaultMessage || '',
    });
  }
}

export class AdaRedemptionEncryptedCertificateParseError extends LocalizableError {
  constructor() {
    super({
      id: messages.adaRedemptionEncryptedCertificateParseError.id,
      defaultMessage: messages.adaRedemptionEncryptedCertificateParseError.defaultMessage || '',
    });
  }
}

export class AdaRedemptionCertificateParseError extends LocalizableError {
  constructor() {
    super({
      id: messages.adaRedemptionCertificateParseError.id,
      defaultMessage: messages.adaRedemptionCertificateParseError.defaultMessage || '',
    });
  }
}

export class NoCertificateError extends LocalizableError {
  constructor() {
    super({
      id: messages.noCertificateError.id,
      defaultMessage: messages.noCertificateError.defaultMessage || '',
    });
  }
}

export class RedemptionKeyAlreadyUsedError extends LocalizableError {
  constructor() {
    super({
      id: messages.redemptionKeyAlreadyUsedError.id,
      defaultMessage: messages.redemptionKeyAlreadyUsedError.defaultMessage || '',
    });
  }
}

export class ServerStatusError extends LocalizableError {
  constructor() {
    super({
      id: messages.serverStatusError.id,
      defaultMessage: messages.serverStatusError.defaultMessage || '',
    });
  }
}
