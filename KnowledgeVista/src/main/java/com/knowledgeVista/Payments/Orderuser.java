package com.knowledgeVista.Payments;



import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table
@Getter@Setter@NoArgsConstructor
public class Orderuser {
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String orderId;
	    private Long userId;
	    private Long courseId;
	    private String paymentId;
	    @Column(columnDefinition = "Varchar(50)")
	    private String status;
	    private Long amountReceived;
	    private LocalDate date;
 
}