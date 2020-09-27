package io.choerodon.agile.api.vo;

import java.util.HashSet;
import java.util.Set;

import org.hzero.boot.message.entity.MessageSender;
import org.hzero.boot.message.entity.Receiver;

/**
 * @author jiaxu.cui@hand-china.com 2020/9/25 下午4:51
 */
public class MessageSenderUniqueVO {
    
    public MessageSenderUniqueVO(MessageSender messageSender){
        this.msgCode = messageSender.getMessageCode();
        this.receiverList = new HashSet<>(messageSender.getReceiverAddressList());
        this.ccList = new HashSet<>(messageSender.getCcList());
        this.tenantId = messageSender.getTenantId();
        this.noticeTypeList = new HashSet<>(messageSender.getTypeCodeList());
    }
    
    public MessageSenderUniqueVO(){
    }

    /**
     * 租户Id
     */
    private Long tenantId;
    /**
     * 消息代码
     */
    private String msgCode;
    /**
     * 通知类型
     */
    private Set<String> noticeTypeList;
    
    /**
     * 接收人
     */
    private Set<Receiver> receiverList;
    /**
     * 抄送人
     */
    private Set<String> ccList;


    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    public String getMsgCode() {
        return msgCode;
    }

    public void setMsgCode(String msgCode) {
        this.msgCode = msgCode;
    }

    public Set<String> getNoticeTypeList() {
        return noticeTypeList;
    }

    public void setNoticeTypeList(Set<String> noticeTypeList) {
        this.noticeTypeList = noticeTypeList;
    }

    public Set<Receiver> getReceiverList() {
        return receiverList;
    }

    public void setReceiverList(Set<Receiver> receiverList) {
        this.receiverList = receiverList;
    }

    public Set<String> getCcList() {
        return ccList;
    }

    public void setCcList(Set<String> ccList) {
        this.ccList = ccList;
    }
}
