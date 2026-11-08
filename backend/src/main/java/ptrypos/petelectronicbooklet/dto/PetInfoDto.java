package ptrypos.petelectronicbooklet.dto;

import java.time.LocalDate;
import java.util.List;

public class PetInfoDto {

    private Long id;
    private String name;
    private String gender;
    private String species;
    private String birthDate;
    private List<VetVisitDto> vetVisits;
    private List<VaccinationDto> vaccinations;

    public PetInfoDto(Long id, String name, String gender, String species, String birthDate, List<VetVisitDto> vetVisits, List<VaccinationDto> vaccinations) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.species = species;
        this.birthDate = birthDate;
        this.vetVisits = vetVisits;
        this.vaccinations = vaccinations;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGender() {
        return gender;
    }

    public String getSpecies() {
        return species;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public List<VetVisitDto> getVetVisits() {
        return vetVisits;
    }

    public List<VaccinationDto> getVaccinations() {
        return vaccinations;
    }
}