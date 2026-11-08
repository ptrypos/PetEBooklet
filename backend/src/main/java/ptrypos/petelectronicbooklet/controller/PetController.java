package ptrypos.petelectronicbooklet.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ptrypos.petelectronicbooklet.dto.*;
import ptrypos.petelectronicbooklet.service.PetService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/pets")
public class PetController {

    @Autowired
    PetService petService;

    @GetMapping("/retrieve_pet_info/{petId}")
    public ResponseEntity<Map<String, PetInfoDto>> getPetInfo(@PathVariable Long petId, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        PetInfoDto petInfo = petService.retrievePetInfoById(petId, userId);

        Map<String, PetInfoDto> response = new HashMap<>();
        response.put("pet_info", petInfo);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change_pet_birthdate/{petId}")
    public ResponseEntity<Map<String, String>> changePetBirthdate(@PathVariable Long petId, @RequestBody Map<String, String> requestBody, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        petService.changePetBirthdate(petId, userId, requestBody);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Birthdate has been changed successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get_vaccinations")
    public ResponseEntity<List<VaccinationDto>> getVaccinations(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        List<VaccinationDto> vaccinations = petService.getVaccinations(userId);
        return ResponseEntity.ok(vaccinations);
    }

    @PostMapping("/add_vaccination/{petId}")
    public ResponseEntity<Map<String, String>> addVaccination(@Valid @RequestBody AddVaccinationDto addVaccinationDto, @PathVariable Long petId, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        petService.addVaccinationToPet(addVaccinationDto, petId, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vaccination has been added successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get_vet_visits")
    public ResponseEntity<List<VetVisitDto>> getVetVisits(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        List<VetVisitDto> vetVisits = petService.getVetVisits(userId);
        return ResponseEntity.ok(vetVisits);
    }

    @PostMapping("/add_vet_visit/{petId}")
    public ResponseEntity<Map<String, String>> addVetVisit(@Valid @RequestBody AddVetVisitDto addVetVisitDto, @PathVariable Long petId, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        petService.addVetVisitToPet(addVetVisitDto, petId, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vet visit has been added successfully");
        return ResponseEntity.ok(response);
    }
}