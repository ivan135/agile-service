import React, { createContext, useMemo, useRef } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import EditIssueStore from './EditIssueStore';

const EditIssueContext = createContext();
export default EditIssueContext;

export const EditIssueContextProvider = injectIntl(inject('AppState', 'HeaderStore')((props) => {
  const FieldVersionRef = {
    current: null,
  };
  const FieldFixVersionRef = {
    current: null,
  };
  const isOnlyAgileProject = props.AppState.menuType.category === 'AGILE';
  const descriptionEditRef = useRef(false);
  const value = {
    ...props,
    isOnlyAgileProject,
    prefixCls: 'c7n-agile-EditIssue',
    intlPrefix: 'agile.EditIssue',
    store: useMemo(() => new EditIssueStore(), []), // 防止update时创建多次store
    FieldVersionRef,
    FieldFixVersionRef,
    descriptionEditRef,
    saveFieldVersionRef: (ref) => {
      FieldVersionRef.current = ref;
    },
    saveFieldFixVersionRef: (ref) => {
      FieldFixVersionRef.current = ref;
    },
  };

  return (
    <EditIssueContext.Provider value={value}>
      {props.children}
    </EditIssueContext.Provider>
  );
}));
