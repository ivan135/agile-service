import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Collapse } from 'choerodon-ui';
import { isEqual } from 'lodash';
import './RenderSwimLaneContext.less';

import { localPageCacheStore } from '@/stores/common/LocalPageCacheStore';
import scrumBoardStore from '@/stores/project/scrumBoard/ScrumBoardStore';
import SwimLaneHeader from './SwimLaneHeader';

const { Panel } = Collapse;

const getDefaultExpanded = (issueArr) => [...issueArr.map((issue) => `swimlane_epic%${issue.epicId}`), 'swimlane_epic%other'];
@observer
class EpicRenderHeader extends Component {
  constructor(props) {
    super(props);
    const defaultCacheActiveKeys = localPageCacheStore.getItem(`scrumBoard.panel-epic-${props.mode}`);

    this.state = {
      defaultActiveKey: defaultCacheActiveKeys,
      activeKey: [],
      issues: [],
    };
  }

  componentDidMount() {
    scrumBoardStore.bindFunction('expandOrUp-epic', this.handleExpandOrUPPanel);
    const issueLimitArr = [];
    let limitCount = 0;
    const parentIssueArr = Array.from(this.props.parentIssueArr);
    for (let i = 0; i < parentIssueArr.length && limitCount < 15; i += 1) {
      const [key, value] = parentIssueArr[i];
      issueLimitArr.push({ key: this.getPanelKey(key), activeNumber: value.issueArrLength });
      limitCount += value.issueArrLength;
    }
    if (limitCount < 15 && this.props.otherIssueWithoutParent.interConnectedDataMap && this.props.otherIssueWithoutParent.interConnectedDataMap.size > 0) {
      issueLimitArr.push({ key: 'swimlane_epic%unInterconnected', activeNumber: 15 - limitCount });
    }
    if (limitCount > 15) {
      issueLimitArr[issueLimitArr.length - 1].activeNumber = 15 - issueLimitArr[issueLimitArr.length - 1].activeNumber;
    }
    scrumBoardStore.bindFunction('expandOrUp-epic-store', () => issueLimitArr);
  }

  componentWillUnmount() {
    scrumBoardStore.removeBindFunction('expandOrUp-epic');
    scrumBoardStore.removeBindFunction('expandOrUp-epic-store');
  }

  handleExpandOrUPPanel = (expandAll = true) => {
    this.panelOnChange(expandAll ? getDefaultExpanded([...this.props.parentIssueArr.values(), this.props.otherIssueWithoutParent]).slice(0, 15) : []);
  }

  static getDerivedStateFromProps(props, state) {
    const issues = [...props.parentIssueArr.values(), props.otherIssueWithoutParent];
    const activeKey = getDefaultExpanded(issues);
    const activeKeyFromOld = getDefaultExpanded(state.issues);
    if (!isEqual(activeKey, activeKeyFromOld)) {
      return {
        issues,
        activeKey: state.defaultActiveKey || activeKey,
        defaultActiveKey: undefined,
      };
    }
    return null;
  }

  getPanelKey = (key) => {
    if (key === 'other') {
      return 'swimlane_epic%other';
    }
    return `swimlane_epic%${key}`;
  };

  getPanelItem = (key, parentIssue) => {
    const { activeKey } = this.state;
    const { children, mode } = this.props;
    const panelKey = this.getPanelKey(key);
    const active = activeKey.includes(panelKey);
    return (
      <Panel
        key={this.getPanelKey(key)}
        className="c7n-swimlaneContext-container"
        header={(
          <SwimLaneHeader
            parentIssue={parentIssue}
            mode={mode}
            keyId={key}
            subIssueDataLength={parentIssue.issueArrLength}
          />
        )}
      >
        {active && children(key === 'other' ? parentIssue : parentIssue.subIssueData, key === 'other' ? 'swimlane_epic%unInterconnected' : `swimlane_epic%${parentIssue.epicId}`)}
      </Panel>
    );
  };

  panelOnChange = (arr) => {
    this.setState({
      activeKey: arr,
    });
    localPageCacheStore.setItem(`scrumBoard.panel-epic-${this.props.mode}`, arr);
  };

  render() {
    const { parentIssueArr, otherIssueWithoutParent } = this.props;
    const { activeKey } = this.state;
    return (
      <Collapse
        activeKey={activeKey}
        onChange={this.panelOnChange}
        bordered={false}
        destroyInactivePanel
      >
        {Array.from(parentIssueArr).map(([key, value]) => this.getPanelItem(key, value))}
        {this.getPanelItem('other', otherIssueWithoutParent)}
      </Collapse>
    );
  }
}

export default EpicRenderHeader;
