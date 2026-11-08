package ptrypos.petelectronicbooklet.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptrypos.petelectronicbooklet.model.VetVisit;

@Repository
public interface VetVisitsRepository extends JpaRepository<VetVisit, Long> {
}
