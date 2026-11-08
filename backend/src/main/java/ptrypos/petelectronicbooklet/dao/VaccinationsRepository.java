package ptrypos.petelectronicbooklet.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptrypos.petelectronicbooklet.model.Vaccination;

@Repository
public interface VaccinationsRepository extends JpaRepository<Vaccination, Long> {
}
