// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { intlShape, defineMessages, FormattedHTMLMessage } from 'react-intl';
import SvgInline from 'react-svg-inline';
import styles from './ServerErrorBanner.scss';
import warningSvg from '../../../assets/images/warning.inline.svg';
import type { ServerStatusErrorType } from '../../../types/serverStatusErrorType';

const messages = defineMessages({
  serverErrorLabel: {
    id: 'serverError.label.message',
    defaultMessage: '!!!WARNING: Server experiencing difficulties.<br>Please check <a target="blank" href="https://twitter.com/YoroiWallet">our Twitter account</a>.<br>The displayed balance and transaction history may appear incorrect until our servers are back to normal, but your actual balance is not affected.',
  },
  networkErrorLabel: {
    id: 'networkError.label.message',
    defaultMessage: '!!!WARNING: Connection to the server failed.<br>Please check your internet connection or <a target="blank" href="https://twitter.com/YoroiWallet">our Twitter account</a>.<br>The displayed balance and transaction history may appear incorrect until our servers are back to normal, but your actual balance is not affected.',
  },
});

type Props = {
  errorType: ServerStatusErrorType,
};


@observer
export default class ServerErrorBanner extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const {
      errorType
    } = this.props;

    const displayMessage = (() => {
      switch (errorType) {
        case 'server':
          return messages.serverErrorLabel;
        case 'network':
          return messages.networkErrorLabel;
        default:
          return null;
      }
    })();

    return (
      <div>
        {displayMessage === null ? null : (
          <div className={styles.serverError}>
            <SvgInline key="0" svg={warningSvg} className={styles.warningIcon} />
            <FormattedHTMLMessage {...displayMessage} key="1" />

          </div>)
        }
      </div>
    );
  }
}
