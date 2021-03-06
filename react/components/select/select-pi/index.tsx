import React, { useMemo, forwardRef, useRef } from 'react';
import { Select } from 'choerodon-ui/pro';
import { SelectProps } from 'choerodon-ui/pro/lib/select/Select';
import useSelect, { SelectConfig, FragmentForSearch, LoadConfig } from '@/hooks/useSelect';
import FlatSelect from '@/components/flat-select';
import { piApi } from '@/api';
import type { PI } from '@/common/types';
import styles from './index.less';

const renderPi = (pi: any) => {
  if (pi) {
    return (
      <div style={{ display: 'inline-block' }}>
        {pi.id === '0' ? pi.name : `${pi.code}-${pi.name}`}
        {
          pi.statusCode === 'doing' && (
            <div className={styles.current}>当前</div>
          )
        }
      </div>
    );
  }
  return null;
};
interface Props extends Partial<SelectProps> {
  statusList?: string[]
  afterLoad?: (piList: PI[]) => void
  request?: ({ filter, page }: LoadConfig) => Promise<PI[]>
  multiple?: boolean
  disabledCurrentPI?: boolean
  dataRef?: React.MutableRefObject<any>
  flat?: boolean
  addPi0?: boolean
}
const SelectPI: React.FC<Props> = forwardRef(({
  dataRef, statusList, disabledCurrentPI = false, afterLoad, request, flat, addPi0, ...otherProps
}, ref: React.Ref<Select>) => {
  const afterLoadRef = useRef<Props['afterLoad']>();
  afterLoadRef.current = afterLoad;
  const config = useMemo((): SelectConfig<PI> => ({
    name: 'all_pi',
    textField: 'piName',
    valueField: 'id',
    request: request || (() => piApi.getPiListByStatus(statusList)),
    optionRenderer: (pi) => (
      <FragmentForSearch name={pi.id === '0' ? pi.name : `${pi.code}-${pi.name}`}>
        {renderPi(pi)}
      </FragmentForSearch>
    ),
    afterLoad: afterLoadRef.current,
    middleWare: (piList) => {
      if (dataRef) {
        Object.assign(dataRef, {
          current: piList,
        });
      }
      return addPi0 ? [{ id: '0', name: '未分配PI' } as unknown as PI, ...piList] : piList;
    },
    props: {
      // @ts-ignore
      onOption: ({ record }) => {
        if (disabledCurrentPI && record.get('statusCode') === 'doing') {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    paging: false,
  }), [JSON.stringify(statusList)]);
  const props = useSelect(config);

  const Component = flat ? FlatSelect : Select;
  return (
    <Component
      ref={ref}
      {...props}
      {...otherProps}
    />
  );
});
export default SelectPI;
