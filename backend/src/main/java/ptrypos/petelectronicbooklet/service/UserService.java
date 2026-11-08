package ptrypos.petelectronicbooklet.service;

import ptrypos.petelectronicbooklet.dto.AddPetDto;
import ptrypos.petelectronicbooklet.dto.OwnedPetDto;
import ptrypos.petelectronicbooklet.dto.UserLoginDto;
import ptrypos.petelectronicbooklet.dto.UserRegistrationDto;

import java.util.List;

public interface UserService {

    void registerUser(UserRegistrationDto userRegistrationDto);

    String loginUser(UserLoginDto userLoginDto);

    List<OwnedPetDto> getPets(Long userId);

    void addPet(AddPetDto addPetDto, Long userId);

    void removePet(Long petId, Long userId);
}