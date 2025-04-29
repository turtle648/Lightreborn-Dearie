package com.ssafy.backend.common.security;

import com.ssafy.backend.auth.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userIdString) throws UsernameNotFoundException {
        Long userId;

        try {
            userId = Long.parseLong(userIdString);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid user ID format: " + userIdString);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        return new CustomUserDetails(user);
    }
}
