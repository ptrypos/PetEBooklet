package ptrypos.petelectronicbooklet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ptrypos.petelectronicbooklet.dao.PetRepository;
import ptrypos.petelectronicbooklet.dao.UserRepository;
import ptrypos.petelectronicbooklet.dao.VaccinationsRepository;
import ptrypos.petelectronicbooklet.dao.VetVisitsRepository;
import ptrypos.petelectronicbooklet.dto.*;
import ptrypos.petelectronicbooklet.exception.UserNotFoundException;
import ptrypos.petelectronicbooklet.model.Pet;
import ptrypos.petelectronicbooklet.model.User;
import ptrypos.petelectronicbooklet.model.Vaccination;
import ptrypos.petelectronicbooklet.model.VetVisit;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VaccinationsRepository vaccinationsRepository;

    @Autowired
    private VetVisitsRepository vetVisitsRepository;

    private List<VetVisitDto> createVetVisits(Pet retrievedPet) {
        List<VetVisitDto> vetVisits = new ArrayList<>();
        if (retrievedPet.getVetVisits() != null) {
            for (VetVisit vetVisit : retrievedPet.getVetVisits()) {
                Long vetVisitId = vetVisit.getId();
                LocalDate vetVisitDate = vetVisit.getVisitDate();
                String vetVisitReason = vetVisit.getReason();
                String vetVisitNotes = vetVisit.getNotes();

                VetVisitDto vetVisitDto = new VetVisitDto(vetVisitId, retrievedPet.getName(), vetVisitDate, vetVisitReason, vetVisitNotes);
                vetVisits.add(vetVisitDto);
            }
        }
        return vetVisits;
    }

    private List<VaccinationDto> createVaccinations(Pet retrievedPet) {
        List<VaccinationDto> vaccinations = new ArrayList<>();
        if (retrievedPet.getVaccinations() != null) {
            for (Vaccination vaccination : retrievedPet.getVaccinations()) {
                Long vaccinationId = vaccination.getId();
                String vaccinationName = vaccination.getVaccineName();
                LocalDate vaccinationDateGiven = vaccination.getDateGiven();
                LocalDate vaccinationValidUntil = vaccination.getValidUntil();

                VaccinationDto vaccinationDto = new VaccinationDto(vaccinationId, retrievedPet.getName(), vaccinationName, vaccinationDateGiven, vaccinationValidUntil);
                vaccinations.add(vaccinationDto);
            }
        }
        return vaccinations;
    }

    private Pet retrievePet(Long petId) {
        return petRepository.findById(petId)
                .orElseThrow(() -> new UserNotFoundException("Pet not found"));
    }

    private void validatePetOwnership(Pet pet, Long userId) {
        User petOwner = pet.getOwner();
        Long ownerId = petOwner.getId();

        boolean isPetOwner = ownerId.equals(userId);

        if (!isPetOwner) {
            throw new IllegalArgumentException("You are not allowed to perform this operation");
        }
    }

    private User retrieveUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return user.get();
    }

    @Override
    public PetInfoDto retrievePetInfoById(Long petId, Long ownerId) {
        Pet retrievedPet = retrievePet(petId);
        validatePetOwnership(retrievedPet, ownerId);

        String petName = retrievedPet.getName();
        String gender = retrievedPet.getGender() != null ? retrievedPet.getGender().toString() : "";
        String species = retrievedPet.getSpecies() != null ? retrievedPet.getSpecies().toString() : "";
        String birthDate = "";

        if (retrievedPet.getBirthDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            birthDate = retrievedPet.getBirthDate().format(formatter);
        }

        List<VetVisitDto> vetVisits = createVetVisits(retrievedPet);
        List<VaccinationDto> vaccinations = createVaccinations(retrievedPet);

        return new PetInfoDto(petId, petName, gender, species, birthDate, vetVisits, vaccinations);
    }

    @Override
    public void changePetBirthdate(Long petId, Long ownerId, Map<String, String> requestBody) {
        Pet retrievedPet = retrievePet(petId);
        validatePetOwnership(retrievedPet, ownerId);

        String newBirthDate = requestBody.get("birthDate");
        LocalDate newBirthDateFormatted = LocalDate.parse(newBirthDate, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        retrievedPet.setBirthDate(newBirthDateFormatted);

        petRepository.save(retrievedPet);
    }

    @Override
    public List<VaccinationDto> getVaccinations(Long ownerId) {
        User user = retrieveUser(ownerId);
        List<Pet> pets = user.getPets();

        List<VaccinationDto> vaccinations = new ArrayList<>();
        for (Pet pet : pets) {
            List<Vaccination> petVaccinations = pet.getVaccinations();

            for (Vaccination vaccination : petVaccinations) {
                Long vaccinationId = vaccination.getId();
                String vaccinationName = vaccination.getVaccineName();
                LocalDate vaccinationDateGiven = vaccination.getDateGiven();
                LocalDate vaccinationValidUntil = vaccination.getValidUntil();

                VaccinationDto vaccinationDto = new VaccinationDto(vaccinationId, pet.getName(), vaccinationName, vaccinationDateGiven, vaccinationValidUntil);
                vaccinations.add(vaccinationDto);
            }
        }

        return vaccinations;
    }

    @Override
    public void addVaccinationToPet(AddVaccinationDto addVaccinationDto, Long petId, Long ownerId) {
        Pet retrievedPet = retrievePet(petId);
        validatePetOwnership(retrievedPet, ownerId);

        String vaccinationName = addVaccinationDto.getName();
        String vaccinationDateGiven = addVaccinationDto.getDateGiven();
        String vaccinationValidUntil = addVaccinationDto.getValidUntil();

        LocalDate vaccinationDateGivenConverted = LocalDate.parse(vaccinationDateGiven, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        LocalDate vaccinationValidUntilConverted = LocalDate.parse(vaccinationValidUntil, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        Vaccination newVaccination = new Vaccination(retrievedPet, vaccinationName, vaccinationDateGivenConverted, vaccinationValidUntilConverted);

        vaccinationsRepository.save(newVaccination);
    }

    @Override
    public List<VetVisitDto> getVetVisits(Long ownerId) {
        User user = retrieveUser(ownerId);
        List<Pet> pets = user.getPets();

        List<VetVisitDto> vetVisits = new ArrayList<>();
        for (Pet pet : pets) {
            List<VetVisit> petVetVisits = pet.getVetVisits();

            for (VetVisit vetVisit : petVetVisits) {
                Long vetVisitId = vetVisit.getId();
                LocalDate visitDate = vetVisit.getVisitDate();
                String reason = vetVisit.getReason();
                String notes = vetVisit.getNotes();

                VetVisitDto vetVisitDto = new VetVisitDto(vetVisitId, pet.getName(), visitDate, reason, notes);
                vetVisits.add(vetVisitDto);
            }
        }

        return vetVisits;
    }

    @Override
    public void addVetVisitToPet(AddVetVisitDto addVetVisitDto, Long petId, Long ownerId) {
        Pet retrievedPet = retrievePet(petId);
        validatePetOwnership(retrievedPet, ownerId);

        String vetVisitDate = addVetVisitDto.getVisitDate();
        String vetVisitReason = addVetVisitDto.getReason();
        String vetVisitNotes = addVetVisitDto.getNotes();

        LocalDate vetVisitDateConverted = LocalDate.parse(vetVisitDate, DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        VetVisit newVetVisit = new VetVisit(retrievedPet, vetVisitDateConverted, vetVisitReason, vetVisitNotes);

        vetVisitsRepository.save(newVetVisit);
    }
}