// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';
import SvgInline from 'react-svg-inline';

import globalMessages from '../../../i18n/global-messages';
import LocalizableError from '../../../i18n/LocalizableError';

import Dialog from '../../widgets/Dialog';
import DialogBackButton from '../../widgets/DialogBackButton';
import DialogCloseButton from '../../widgets/DialogCloseButton';

import ProgressStepBlock from './common/ProgressStepBlock';
import HelpLinkBlock from './common/HelpLinkBlock';
import TrezorErrorBlock from './common/TrezorErrorBlock';

import connectLoadGIF from '../../../assets/images/trezor/connect/connect-load.gif';
import connectStartGIF from '../../../assets/images/trezor/connect/connect-start.gif';
import connectErrorSVG from '../../../assets/images/trezor/connect/connect-error.inline.svg';
import connectLoadImage from '../../../assets/images/wallet-connect/connect-load.inline.svg';
import connectErrorImage from '../../../assets/images/wallet-connect/connect-error.inline.svg';

import type { ProgressInfo } from '../../../stores/ada/TrezorConnectStore';
import { StepState } from '../../../stores/ada/TrezorConnectStore';

import { Logger } from '../../../utils/logging';

import styles from './ConnectDialog.scss';

const messages = defineMessages({
  connectIntroTextLine1: {
    id: 'wallet.trezor.dialog.step.connect.introText.line.1',
    defaultMessage: '!!!After connecting your Trezor device to the computer press the Connect button.',
    description: 'Header text of about step on the Connect to Trezor Hardware Wallet dialog.'
  },
  connectIntroTextLine2: {
    id: 'wallet.trezor.dialog.step.connect.introText.line.2',
    defaultMessage: '!!!A new tab will appear, please follow the instructions in the new tab.',
    description: 'Header text of about step on the Connect to Trezor Hardware Wallet dialog.'
  },
  connectIntroTextLine3: {
    id: 'wallet.trezor.dialog.step.connect.introText.line.3',
    defaultMessage: '!!!This process shares the Cardano public key with Yoroi.',
    description: 'Header text of about step on the Connect to Trezor Hardware Wallet dialog.'
  },
  connectButtonLabel: {
    id: 'wallet.trezor.dialog.connect.button.label',
    defaultMessage: '!!!Connect',
    description: 'Label for the "Connect" button on the Connect to Trezor Hardware Wallet dialog.'
  },
});

type Props = {
  progressInfo: ProgressInfo,
  isActionProcessing: boolean,
  error: ?LocalizableError,
  goBack: Function,
  submit: Function,
  cancel: Function,
  classicTheme: boolean
};

@observer
export default class ConnectDialog extends Component<Props> {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.context;
    const {
      progressInfo,
      isActionProcessing,
      error,
      goBack,
      submit,
      cancel,
      classicTheme
    } = this.props;
    const headerBlockClasses = classicTheme ? styles.headerBlockClassic : styles.headerBlock;
    const middleBlockClasses = classicTheme ? styles.middleBlockClassic : styles.middleBlock;

    const introBlock = (
      <div className={headerBlockClasses}>
        <span>{intl.formatMessage(messages.connectIntroTextLine1)}</span><br />
        <span>{intl.formatMessage(messages.connectIntroTextLine2)}</span><br />
        <span>{intl.formatMessage(messages.connectIntroTextLine3)}</span><br />
      </div>);

    let middleBlock = null;
    let backButton = null;

    switch (progressInfo.stepState) {
      case StepState.LOAD:
        backButton = (<DialogBackButton onBack={goBack} />);
        middleBlock = (
          <div className={classnames([middleBlockClasses, styles.middleConnectLoadBlock])}>
            {classicTheme ? <img src={connectLoadGIF} alt="" /> : <SvgInline svg={connectLoadImage} cleanup={['title']} />}
          </div>);
        break;
      case StepState.PROCESS:
        backButton = null;
        middleBlock = (
          <div className={classnames([middleBlockClasses, styles.middleConnectProcessBlock])}>
            {classicTheme ? <img src={connectStartGIF} alt="" /> : <SvgInline svg={connectLoadImage} cleanup={['title']} />}
          </div>);
        break;
      case StepState.ERROR:
        backButton = (<DialogBackButton onBack={goBack} />);
        middleBlock = (
          <div className={classnames([middleBlockClasses, styles.middleConnectErrorBlock])}>
            <SvgInline svg={classicTheme ? connectErrorSVG : connectErrorImage} />
          </div>);
        break;
      default:
        Logger.error('trezorConnect::ConnectDialog::render: something unexpected happened');
        break;
    }

    const dailogActions = [{
      className: isActionProcessing ? styles.processing : null,
      label: intl.formatMessage(messages.connectButtonLabel),
      primary: true,
      disabled: isActionProcessing,
      onClick: submit
    }];

    return (
      <Dialog
        className={classnames([styles.component, 'AboutDialog'])}
        title={intl.formatMessage(globalMessages.trezorConnectAllDialogTitle)}
        actions={dailogActions}
        closeOnOverlayClick={false}
        onClose={cancel}
        backButton={backButton}
        closeButton={<DialogCloseButton />}
        classicTheme={classicTheme}
      >
        <ProgressStepBlock progressInfo={progressInfo} classicTheme={classicTheme} />
        {introBlock}
        {middleBlock}

        {!classicTheme && (
          <TrezorErrorBlock progressInfo={progressInfo} error={error} classicTheme={classicTheme} />
        )}

        <HelpLinkBlock progressInfo={progressInfo} classicTheme={classicTheme} />

        {classicTheme && (
          <TrezorErrorBlock progressInfo={progressInfo} error={error} classicTheme={classicTheme} />
        )}
      </Dialog>);
  }
}
