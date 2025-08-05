package dev.mvc.board;

public class Contents {
    /** 페이지당 출력할 레코드 갯수 */
    public static int RECORD_PER_PAGE = 5;

    /** 블럭당 페이지 수, 하나의 블럭은 10개의 페이지로 구성됨 */
    public static int PAGE_PER_BLOCK = 10;

    public static String getUploadDir() {
        String osName = System.getProperty("os.name").toLowerCase();
        String path = "";

        if (osName.contains("win")) { // Windows
            path = "C:\\kd\\deploy\\team3\\board\\storage\\";
        } else if (osName.contains("mac")) { // MacOS
            path = "/Users/imgwanghwan/kd/deploy/team3/board/storage/";
        } else { // Linux
            path = "/home/ubuntu/deploy/team3/board/storage/";
        }

        return path;
    }
}
