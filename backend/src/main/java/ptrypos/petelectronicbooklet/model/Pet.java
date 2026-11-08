package ptrypos.petelectronicbooklet.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    private String name;

    private PetSpecies species;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private PetGender gender;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<VetVisit> vetVisits;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<Vaccination> vaccinations;

    public Pet() {
    }

    public Pet(String name, User owner, PetSpecies species, PetGender gender, LocalDate birthDate) {
        this.name = name;
        this.owner = owner;
        this.species = species;
        this.birthDate = birthDate;
        this.gender = gender;
    }

    public Long getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public PetSpecies getSpecies() {
        return species;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public PetGender getGender() {
        return gender;
    }

    public List<VetVisit> getVetVisits() {
        return vetVisits;
    }

    public void addVetVisit(VetVisit vetVisit) {
        this.vetVisits.add(vetVisit);
        vetVisit.setPet(this);
    }

    public List<Vaccination> getVaccinations() {
        return vaccinations;
    }

    public void addVaccination(Vaccination vaccination) {
        this.vaccinations.add(vaccination);
        vaccination.setPet(this);
    }
}