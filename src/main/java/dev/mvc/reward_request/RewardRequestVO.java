package dev.mvc.reward_request;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RewardRequestVO {
    private int requestno;
    private int memberno;
    private String fruit_type;
    private String receiver_name;
    private String receiver_phone;
    private String zipcode;
    private String address1;
    private String address2;
    private Date reqdate;
    private String status; // 상태 (예: 신청 완료, 배송 준비중, 배송 완료)
}
