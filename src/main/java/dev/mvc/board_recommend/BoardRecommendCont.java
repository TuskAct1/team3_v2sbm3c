package dev.mvc.board_recommend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/boardRecommend")
public class BoardRecommendCont {

    @Autowired
    private BoardRecommendProcInter boardRecommendProc;


}
