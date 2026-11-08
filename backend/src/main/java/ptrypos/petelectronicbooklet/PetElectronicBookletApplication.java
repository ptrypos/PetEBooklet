package ptrypos.petelectronicbooklet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "ptrypos.petelectronicbooklet.model")
@EnableJpaRepositories(basePackages = "ptrypos.petelectronicbooklet.dao")
public class PetElectronicBookletApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetElectronicBookletApplication.class, args);
    }

}
