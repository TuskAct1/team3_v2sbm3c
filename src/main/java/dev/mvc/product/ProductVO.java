package dev.mvc.product;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class ProductVO {

    private int productno;

    private int memberno;

    private int adminno;

    private String product_name;

    private String product_description;

    private int product_point;

    private int cnt;

    private String image_url;
}
