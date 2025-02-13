// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import SvgInline from 'react-svg-inline';

import iconTickSVG from '../../assets/images/widget/tick.inline.svg';
import iconTickGreenSVG from '../../assets/images/widget/tick-green.inline.svg';
import iconCrossSVG from '../../assets/images/widget/cross.inline.svg';
import iconCrossGreenSVG from '../../assets/images/widget/cross-green.inline.svg';
import styles from './ProgressSteps.scss';

// TODO: move to type folder?
export const StepState = Object.freeze({
  LOAD: 0,
  PROCESS: 1,
  ERROR: 9,
});
export type StepStateEnum = $Values<typeof StepState>;

type Props = {|
  stepsList: Array<string>,
  currentStep : number, // example, 0 = pointing to stepsList[0]
  stepState: StepStateEnum,
  classicTheme: boolean
|};
@observer
export default class ProgressSteps extends Component<Props> {

  createSteps = (
    stepsList: Array<string>,
    currentStep : number,
    stepState: StepStateEnum,
  ): Array<Element<any>> => {
    const { classicTheme } = this.props;
    const steps = [];

    for (let idx = 0; idx < stepsList.length; idx++) {
      const stepText = stepsList[idx];

      let stepTopBarStyle = styles.stepTopBar;
      let stepTextStyle = styles.stepText;
      let displayIcon = 'none';

      if (idx < currentStep) {
        // step already done
        displayIcon = 'done';
        stepTopBarStyle = classNames([
          styles.stepTopBar,
          styles.stepTopBarDone
        ]);
        stepTextStyle = classNames([
          styles.stepText,
          styles.stepTextDone
        ]);
      } else if (idx === currentStep) {
        displayIcon = (stepState === StepState.ERROR) ? 'error' : 'none';
        stepTopBarStyle = classNames([
          styles.stepTopBar,
          styles.stepTopBarActive
        ]);
        stepTextStyle = classNames([
          styles.stepText,
          styles.stepTextActive
        ]);
      }

      steps.push(
        <div key={idx} className={styles.stepBlock}>
          <div className={stepTopBarStyle} />
          <div className={styles.stepBottomBlock}>
            <div className={styles.stepStateIconContainer}>
              {(displayIcon === 'done') && <SvgInline svg={classicTheme ? iconTickSVG : iconTickGreenSVG} />}
              {(displayIcon === 'error') && <SvgInline svg={classicTheme ? iconCrossSVG : iconCrossGreenSVG} />}
            </div>
            <div className={styles.stepTextContainer}>
              <span className={stepTextStyle}>{stepText}</span>
            </div>
          </div>
        </div>
      );
    }

    return steps;
  }

  render() {
    const { stepsList, currentStep, stepState } = this.props;

    return (
      <div className={styles.component}>
        {this.createSteps(
          stepsList,
          currentStep < 0 ? 0 : currentStep,
          stepState
        )}
      </div>
    );
  }

}
