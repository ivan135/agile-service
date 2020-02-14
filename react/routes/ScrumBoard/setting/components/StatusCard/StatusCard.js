import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Radio, Icon, Tooltip, Modal,
} from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';
import { stores, Permission } from '@choerodon/boot';
import ScrumBoardStore from '@/stores/project/scrumBoard/ScrumBoardStore';
import { STATUS } from '@/common/Constant';
import './StatusCard.less';

const { AppState } = stores;
const { confirm, warning } = Modal;
const prefix = 'c7n-scrumsetting-card';
@observer
class StatusCard extends Component {
  getStatusNumber() {
    const data = ScrumBoardStore.getBoardData;
    // 计算所有列下面的状态总数
    const totalStatus = data.reduce((total, column) => total + column.subStatusDTOS.length, 0);
    return totalStatus;
  }

  handleDeleteClick = async () => {
    const { data } = this.props;
    const deleteCode = data.statusId;
    const canBeDeleted = await ScrumBoardStore.axiosStatusCanBeDelete(deleteCode);
    const that = this;
    if (canBeDeleted) {
      confirm({
        title: '移除状态',
        content: `确定要移除状态 ${data.name}？`,
        onOk() {
          that.handleDeleteStatus();
        },
      });
    } else {
      warning({
        title: '移除状态',
        content: `无法移除初始状态 ${data.name}，如要移除请联系组织管理员。`,
      });
    }
  };

  async handleDeleteStatus() {
    const { data: propData, refresh } = this.props;
    const originData = JSON.parse(JSON.stringify(ScrumBoardStore.getBoardData));
    const data = JSON.parse(JSON.stringify(ScrumBoardStore.getBoardData));
    const deleteCode = propData.statusId;
    let deleteIndex = '';
    for (let index = 0, len = data[data.length - 1].subStatusDTOS.length; index < len; index += 1) {
      if (String(data[data.length - 1].subStatusDTOS[index].id) === String(deleteCode)) {
        deleteIndex = index;
      }
    }
    data[data.length - 1].subStatusDTOS.splice(deleteIndex, 1);
    ScrumBoardStore.setBoardData(data);
    try {
      await ScrumBoardStore.axiosDeleteStatus(deleteCode);
    } catch (err) {
      ScrumBoardStore.setBoardData(originData);
    }
    refresh();
  }

  getDisabled = () => {
    const { columnId, data } = this.props;
    if (columnId === 0) {
      if (data.issues.length === 0) {
        if (this.getStatusNumber() <= 1) {
          return [true, '应至少剩余一个状态'];
        }
      }
    }
    return [true, '在普通列中'];
  }

  handleSetComplete = () => {
    const {
      data, refresh,
    } = this.props;
    const clickData = {
      id: data.id,
      statusId: data.statusId,
      objectVersionNumber: data.objectVersionNumber,
      completed: !data.completed,
      projectId: AppState.currentMenuType.id,
    };

    ScrumBoardStore.axiosUpdateIssueStatus(
      data.id, clickData,
    ).then((res) => {
      refresh();
    }).catch((error) => {
    });
  }

  render() {
    const menu = AppState.currentMenuType;
    const { type, id: projectId, organizationId: orgId } = menu;
    const {
      data, index, isDragDisabled,
    } = this.props;
    const [disableDelete, reason] = this.getDisabled();
    return (
      <Draggable
        isDragDisabled={isDragDisabled}
        key={data.code}
        draggableId={`${data.statusId},${data.objectVersionNumber}`}
        index={index}
        type="status"
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={prefix}
          >
            {ScrumBoardStore.getCanAddStatus && (
              <Permission type={type} projectId={projectId} organizationId={orgId} service={['agile-service.issue-status.deleteStatus']}>
                <Tooltip title={disableDelete ? `${reason}，不可删除` : undefined}>
                  <div className={`${prefix}-delete`}>
                    <Button
                      size="small"
                      icon="delete"
                      disabled={disableDelete}
                      onClick={this.handleDeleteClick}
                    />
                  </div>
                </Tooltip>
              </Permission>
            )}
            <div
              className={`${prefix}-status`}
              style={{
                background: STATUS[data.categoryCode],
              }}
            >
              {data.status ? data.status : data.name}
            </div>
            <div className={`${prefix}-content`}>
              {data.issues ? `${data.issues.length} issues` : ''}
            </div>
            <Permission type={type} projectId={projectId} organizationId={orgId} service={['agile-service.issue-status.updateStatus']}>
              <Radio
                style={{ marginRight: 0 }}
                checked={data.completed ? data.completed : false}
                onClick={this.handleSetComplete}
              >
                设置已完成
                <Tooltip title="勾选后，卡片处于此状态的编号会显示为：#̶0̶0̶1̶，卡片状态视为已完成。" placement="topRight">
                  <Icon
                    type="help"
                    className={`${prefix}-set-complete-icon`}                    
                  />
                </Tooltip>
              </Radio>
            </Permission>
          </div>
        )}
      </Draggable>
    );
  }
}

export default StatusCard;
