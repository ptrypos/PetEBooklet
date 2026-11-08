package ptrypos.petelectronicbooklet.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ptrypos.petelectronicbooklet.model.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
}
