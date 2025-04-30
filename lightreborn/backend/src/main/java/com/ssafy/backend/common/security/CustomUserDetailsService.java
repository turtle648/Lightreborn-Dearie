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
        User user = userRepository.findByUserId(userIdString)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userIdString));

        return new CustomUserDetails(user);
    }
}
