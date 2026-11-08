package ptrypos.petelectronicbooklet.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ptrypos.petelectronicbooklet.dao.PetRepository;
import ptrypos.petelectronicbooklet.dao.UserRepository;
import ptrypos.petelectronicbooklet.dto.AddPetDto;
import ptrypos.petelectronicbooklet.dto.OwnedPetDto;
import ptrypos.petelectronicbooklet.dto.UserLoginDto;
import ptrypos.petelectronicbooklet.dto.UserRegistrationDto;
import ptrypos.petelectronicbooklet.exception.UserNotFoundException;
import ptrypos.petelectronicbooklet.model.Pet;
import ptrypos.petelectronicbooklet.model.PetGender;
import ptrypos.petelectronicbooklet.model.PetSpecies;
import ptrypos.petelectronicbooklet.model.User;
import ptrypos.petelectronicbooklet.security.JwtUtil;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User retrieveUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return user.get();
    }

    private boolean isPasswordCorrect(String password, String correctPasswordHashed) {
        return passwordEncoder.matches(password, correctPasswordHashed);
    }

    private boolean userWithEmailExists(String email) {
        User user = userRepository.findByEmail(email);
        return user != null;
    }

    @Override
    public void registerUser(UserRegistrationDto userRegistrationDto) {
        String email = userRegistrationDto.getEmail();

        if (userWithEmailExists(email)) {
            throw new IllegalArgumentException("A user with this email already exists");
        }

        String fullName = userRegistrationDto.getFullName();
        String passwordHash = passwordEncoder.encode(userRegistrationDto.getPassword());

        User userRegistration = new User(fullName, email, passwordHash);

        userRepository.save(userRegistration);
    }

    @Override
    public String loginUser(UserLoginDto userLoginDto) {
        String email = userLoginDto.getEmail();
        String password = userLoginDto.getPassword();

        User user = userRepository.findByEmail(email);
        if (user == null || !isPasswordCorrect(password, user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId());

        user.setActiveToken(token);
        userRepository.save(user);

        return token;
    }

    @Override
    public List<OwnedPetDto> getPets(Long userId) {
        User retrievedOwner = retrieveUser(userId);

        List<OwnedPetDto> petsResponse = new ArrayList<>();
        List<Pet> ownedPets = retrievedOwner.getPets();

        for (Pet pet : ownedPets) {
            Long id = pet.getId();
            String name = pet.getName();
            String species = pet.getSpecies().toString();
            String gender = pet.getGender().toString();
            LocalDate birthDate = pet.getBirthDate();

            OwnedPetDto petResponse = new OwnedPetDto(id, name, species, gender, birthDate);
            petsResponse.add(petResponse);
        }

        return petsResponse;
    }

    @Override
    @Transactional
    public void addPet(AddPetDto addPetDto, Long userId) {
        User retrievedOwner = retrieveUser(userId);

        try {
            String petName = addPetDto.getName();
            String speciesString = addPetDto.getSpecies().toUpperCase();
            String genderString = addPetDto.getGender().toUpperCase();
            LocalDate petBirthDate = addPetDto.getBirthDate();

            PetSpecies petSpeciesEnum = PetSpecies.valueOf(speciesString);
            PetGender petGenderEnum = PetGender.valueOf(genderString);

            Pet pet = new Pet(
                    petName,
                    retrievedOwner,
                    petSpeciesEnum,
                    petGenderEnum,
                    petBirthDate
            );

            retrievedOwner.addPet(pet);
            userRepository.save(retrievedOwner);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid species or gender provided in the request");
        }
    }

    @Override
    @Transactional
    public void removePet(Long petId, Long userId) {
        User retrievedOwner = retrieveUser(userId);

        Pet petToRemove = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("The pet with this id does not exist"));

        User retrievedPetOwner = petToRemove.getOwner();
        Long retrievedOwnerId = retrievedPetOwner.getId();

        if (!retrievedOwnerId.equals(retrievedOwner.getId())) {
            throw new IllegalArgumentException("The pet with this id does not belong to the user");
        }

        retrievedOwner.getPets().remove(petToRemove);
        petRepository.delete(petToRemove);
        userRepository.save(retrievedOwner);
    }
}