/* eslint-disable import/no-anonymous-default-export */
export default ({
  projectId, organizationId, issueSearchStore, events, searchDTO,
}) => ({
  primaryKey: 'issueId',
  autoQuery: false,
  modifiedCheck: false,
  parentField: 'parentId',
  expandField: 'expand',
  idField: 'issueId',
  paging: 'server',
  cacheSelection: true,
  transport: {
    read: ({ params }) => ({
      url: `/agile/v1/projects/${projectId}/issues/include_sub`,
      method: 'post',
      params: {
        ...params,
        organizationId,
      },
      transformRequest: () => {
        const search = searchDTO || issueSearchStore.getCustomFieldFilters();
        return JSON.stringify(search);
      },
    }),
  },
  fields: [
    { name: 'issueId', type: 'string', label: '概要' },
    { name: 'issueTypeId', type: 'object', label: '问题类型' },
    { name: 'issueNum', type: 'string', label: '任务编号' },
    { name: 'priorityId', type: 'string', label: '优先级' },
    { name: 'statusId', type: 'object', label: '状态' },
    { name: 'assigneeId', type: 'string', label: '经办人' },
    { name: 'reporterId', type: 'string', label: '报告人' },
    { name: 'label', type: 'string', label: '标签' },
    { name: 'component', type: 'string', label: '模块' },
    { name: 'storyPoints', type: 'string', label: '故事点' },
    { name: 'version', type: 'string', label: '版本' },
    { name: 'epic', type: 'string', label: '史诗' },
    { name: 'feature', type: 'string', label: '特性' },
    { name: 'lastUpdateDate', type: 'string', label: '最后更新时间' },
    { name: 'creationDate', type: 'string', label: '创建时间' },
    { name: 'estimatedStartTime', type: 'string', label: '预计开始时间' },
    { name: 'estimatedEndTime', type: 'string', label: '预计结束时间' },
    { name: 'remainingTime', type: 'string', label: '剩余预估时间' },
    { name: 'issueSprintVOS', type: 'array', label: '冲刺' },
  ],
  queryFields: [
    { name: 'issueTypeId', type: 'array', label: '问题类型' },
    // { name: 'service', type: 'string', label: service },
    // { name: 'description', type: 'string', label: description },
  ],
  events,
});
