package com.example.demo.repository;

import com.example.demo.model.Review;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
  List<Review> findByLawyerId(Long lawyerId);
  List<Review> findByClientId(Long clientId);
}
