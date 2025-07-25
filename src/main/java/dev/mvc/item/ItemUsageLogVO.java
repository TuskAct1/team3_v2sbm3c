package dev.mvc.item;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter @Setter
public class ItemUsageLogVO {
    private int logno;
    private int memberno;
    private String item_type;
    private Date used_at;
}