package dev.mvc.team3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"dev.mvc"})
@EnableScheduling       // @Scheduled 어노테이션 활성화
public class Team3V2sbm3cApplication {

	public static void main(String[] args) {
		SpringApplication.run(Team3V2sbm3cApplication.class, args);
	}

}
