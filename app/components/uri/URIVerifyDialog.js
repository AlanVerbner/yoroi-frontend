// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Dialog from '../widgets/Dialog';
import DialogCloseButton from '../widgets/DialogCloseButton';
import DialogBackButton from '../widgets/DialogBackButton';
import type { UriParams } from '../../utils/URIHandling';
import globalMessages, { environmentSpecificMessages } from '../../i18n/global-messages';
import environment from '../../environment';
import { formattedWalletAmount } from '../../utils/formatters';
import ExplorableHashContainer from '../../containers/widgets/ExplorableHashContainer';
import RawHash from '../widgets/hashWrappers/RawHash';
import type { ExplorerType } from '../../domain/Explorer';


import styles from './URIVerifyDialog.scss';

const messages = defineMessages({
  uriVerifyTitle: {
    id: 'uri.verify.dialog.title',
    defaultMessage: '!!!Transaction details',
  },
  uriVerifyDialogAddressLabel: {
    id: 'uri.verify.dialog.address.label',
    defaultMessage: '!!!Receiver address',
  },
  uriVerifyDialogText: {
    id: 'uri.verify.dialog.text',
    defaultMessage: '!!!Before continuing, make sure the transaction details are correct.',
  },
});

type Props = {
  onSubmit: Function,
  onCancel: Function,
  uriParams: UriParams,
  classicTheme: boolean,
  selectedExplorer: ExplorerType,
};

@observer
export default class URIVerifyDialog extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { onCancel, onSubmit, classicTheme } = this.props;
    const { intl } = this.context;

    const currency = intl.formatMessage(environmentSpecificMessages[environment.API].currency);

    const dialogClasses = classnames([
      styles.dialog,
      'URIVerifyDialog'
    ]);

    const actions = [
      {
        label: intl.formatMessage(globalMessages.cancel),
        onClick: onCancel
      },
      {
        label: intl.formatMessage(globalMessages.continue),
        onClick: onSubmit,
        primary: true,
      },
    ];

    // TODO: in the future, we will need to confirm which wallet/account to use for this transaction
    return (
      <Dialog
        actions={actions}
        className={dialogClasses}
        title={intl.formatMessage(messages.uriVerifyTitle)}
        closeOnOverlayClick={false}
        closeButton={<DialogCloseButton />}
        classicTheme={classicTheme}
        onClose={onCancel}
        backButton={<DialogBackButton onBack={onCancel} />}
      >
        <div>
          <h2 className={styles.label}>
            {intl.formatMessage(messages.uriVerifyDialogAddressLabel)}:
          </h2>
          <ExplorableHashContainer
            selectedExplorer={this.props.selectedExplorer}
            hash={this.props.uriParams.address}
            light
            linkType="address"
          >
            <RawHash light>
              <span className={styles.address}>{this.props.uriParams.address}</span>
            </RawHash>
          </ExplorableHashContainer>
        </div>
        <div>
          <h2 className={styles.label}>
            {intl.formatMessage(globalMessages.walletSendConfirmationAmountLabel)}:
          </h2>
          <span className={styles.amount}>
            {formattedWalletAmount(this.props.uriParams.amount)} {currency}
          </span>
        </div>
        <p className={styles.textBlock}>
          {intl.formatMessage(messages.uriVerifyDialogText)}
        </p>
      </Dialog>
    );
  }

}
