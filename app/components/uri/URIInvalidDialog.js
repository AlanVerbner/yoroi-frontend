// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import SVGInline from 'react-svg-inline';

import Dialog from '../widgets/Dialog';
import DialogCloseButton from '../widgets/DialogCloseButton';
import globalMessages from '../../i18n/global-messages';
import invalidURIImg from '../../assets/images/uri/invalid-uri.inline.svg';

import styles from './URIInvalidDialog.scss';

const messages = defineMessages({
  uriInvalidTitle: {
    id: 'uri.invalid.dialog.title',
    defaultMessage: '!!!Invalid URL',
  },
  uriInvalidDialogWarningText1: {
    id: 'uri.invalid.dialog.warning.text1',
    defaultMessage: '!!!The link you clicked is invalid. Please ask the receiver to double-check the format.',
  },
  uriInvalidDialogWarningText2: {
    id: 'uri.invalid.dialog.warning.text2',
    defaultMessage: '!!!Please ask the receiver to double-check the format.',
  },
});

type Props = {
  onClose: void => void,
  onSubmit: void => void,
  classicTheme: boolean,
};

@observer
export default class URIInvalidDialog extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { onClose, onSubmit, classicTheme } = this.props;

    const dialogClasses = classnames([
      styles.component,
      'URIInvalidDialog'
    ]);

    const { intl } = this.context;

    const actions = [
      {
        label: intl.formatMessage(globalMessages.continue),
        onClick: onSubmit,
        primary: true
      }
    ];

    return (
      <Dialog
        actions={actions}
        className={dialogClasses}
        title={intl.formatMessage(messages.uriInvalidTitle)}
        closeOnOverlayClick={false}
        closeButton={<DialogCloseButton />}
        classicTheme={classicTheme}
        onClose={onClose}
      >
        <div>
          <center>
            <SVGInline svg={invalidURIImg} className={styles.invalidURIImg} />
          </center>
          <div className={styles.warningText}>
            {intl.formatMessage(messages.uriInvalidDialogWarningText1)}
            <br />
            {intl.formatMessage(messages.uriInvalidDialogWarningText2)}
          </div>
        </div>
      </Dialog>
    );
  }

}
