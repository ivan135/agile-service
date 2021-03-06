package io.choerodon.agile.api.vo;

import io.choerodon.agile.infra.utils.StringUtil;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author dinghuang123@gmail.com
 * @since 2018/7/6
 */
public class CopyConditionVO {

    @ApiModelProperty(value = "问题概要")
    private String summary;

    @ApiModelProperty(value = "是否复制子任务")
    private Boolean subTask;

    @ApiModelProperty(value = "是否复制问题链接")
    private Boolean issueLink;

    @ApiModelProperty(value = "是否复制冲刺")
    private Boolean sprintValues;

    @ApiModelProperty(value = "是否复制自定义字段")
    private Boolean customField;

    private String epicName;

    public String getEpicName() {
        return epicName;
    }

    public void setEpicName(String epicName) {
        this.epicName = epicName;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Boolean getSubTask() {
        return subTask;
    }

    public void setSubTask(Boolean subTask) {
        this.subTask = subTask;
    }

    public Boolean getIssueLink() {
        return issueLink;
    }

    public void setIssueLink(Boolean issueLink) {
        this.issueLink = issueLink;
    }

    public Boolean getSprintValues() {
        return sprintValues;
    }

    public void setSprintValues(Boolean sprintValues) {
        this.sprintValues = sprintValues;
    }

    @Override
    public String toString() {
        return StringUtil.getToString(this);
    }

    public Boolean getCustomField() {
        return customField;
    }

    public void setCustomField(Boolean customField) {
        this.customField = customField;
    }
}
