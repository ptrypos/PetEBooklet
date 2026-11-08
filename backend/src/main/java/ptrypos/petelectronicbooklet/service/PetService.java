package ptrypos.petelectronicbooklet.service;

import org.springframework.http.ResponseEntity;
import ptrypos.petelectronicbooklet.dto.*;

import java.util.List;
import java.util.Map;

public interface PetService {

    PetInfoDto retrievePetInfoById(Long petId, Long ownerId);

    void changePetBirthdate(Long petId, Long ownerId, Map<String, String> requestBody);

    List<VaccinationDto> getVaccinations(Long ownerId);

    void addVaccinationToPet(AddVaccinationDto addVaccinationDto, Long petId, Long ownerId);

    List<VetVisitDto> getVetVisits(Long ownerId);

    void addVetVisitToPet(AddVetVisitDto addVetVisitDto, Long petId, Long ownerId);
}