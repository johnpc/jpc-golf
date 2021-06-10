import {Analytics} from "aws-amplify";

const recordAnalytics = (name) => {
  /**
   * TODO: record analytics
   */
  // Analytics.record({
  //   name,
  //   attributes: {
  //     platform: window.navigator.platform,
  //     appCodeName: window.navigator.appCodeName,
  //     userAgent: window.navigator.userAgent,
  //     oscpu: window.navigator.oscpu,
  //     language: window.navigator.language,
  //     vendor: window.navigator.vendor,
  //   },
  // });
};

export default recordAnalytics;
