// @flow
import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import SVGInline from 'react-svg-inline';
import { Button } from 'react-polymorph/lib/components/Button';
import { ButtonSkin } from 'react-polymorph/lib/skins/simple/ButtonSkin';

import styles from './AdaRedemptionNoWallets.scss';
import icon from '../../../assets/images/attention-big-thin.inline.svg';

const messages = defineMessages({
  headLine: {
    id: 'wallet.redeem.noWallets.headLine',
    defaultMessage: '!!!Ada redemption is not available because you don\'t have any wallets.',
  },
  instructions: {
    id: 'wallet.redeem.noWallets.instructions',
    defaultMessage: '!!!Create a new wallet (or restore an existing one), come back here and choose it for Ada redemption.',
  },
  createWalletLink: {
    id: 'wallet.redeem.noWallets.createWalletLink',
    defaultMessage: '!!!Create your first wallet',
  },
});

type Props = {|
  onGoToCreateWalletClick: Function,
  classicTheme: boolean,
|};

export default class AdaRedemptionNoWallets extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { intl } = this.context;

    return (
      <div className={styles.component}>
        <SVGInline svg={icon} className={styles.icon} />
        <h1>{intl.formatMessage(messages.headLine)}</h1>
        <p>{intl.formatMessage(messages.instructions)}</p>
        <p>
          <Button
            className="primary"
            onClick={this.props.onGoToCreateWalletClick}
            label={intl.formatMessage(messages.createWalletLink)}
            skin={ButtonSkin}
          />
        </p>
      </div>
    );
  }
}
