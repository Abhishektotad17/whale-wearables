# NextGear Wearables

This is the frontend application for NextGear Wearables, developed using React JS and modern frontend tools to deliver a responsive, performant, and secure user experience.

## Tech Stack & Tools

- **React JS**: Core UI framework for building interactive user interfaces.
- **Vite**: Next-generation frontend tooling for fast development and optimized builds.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Lucide Icons**: Clean and customizable SVG icon library.
- **Framer Motion**: Animation library for declarative and smooth UI animations.

 - AWS Cloud Infrastructure: **Amazon EC2** – Hosts the Spring Boot backend (running in background), **Amazon RDS (PostgreSQL)** – For persistent user & order data, **Amazon S3** – Static storage for product images and frontend hosting, **Amazon CloudFront** – CDN for global content delivery

- Infrastructure as Code with Terraform:
To make deployments consistent, scalable, and repeatable, I used Terraform for provisioning and managing AWS resources.

 - Through Terraform, I automated:
 → S3 bucket creation and CloudFront distribution setup
 → IAM policies & access roles for secure deployment
 → Versioned infrastructure code enabling easy rollbacks & updates
This approach helped me deploy the entire frontend on AWS with just one command, ensuring production-grade reliability and cost efficiency (even on Free Tier 😉).

## Key Dependencies

- **axios**: For making HTTP API calls.
- **@react-oauth/google** & **jwt-decode**: Google OAuth integration and token decoding.
- **react-hook-form** & **@hookform/resolvers**: Form management and validation for login and authentication flows.
- **yup**: Schema-based form validation.
- **react-redux** (v9) & **@reduxjs/toolkit**: State management using Redux Toolkit, simplifying redux development without requiring `@types/react-redux` in this version.
- **cashfree-sdk** (or relevant package): Integration with Cashfree payment gateway for secure transactions.

## Features

- **Authentication**: Supports traditional login/signup with JWT-based authentication and Google OAuth login.
- **Product Catalog**: Fetch product details & images stored in AWS S3
- **Shopping Cart**: Add/remove products, persist cart items
- **Order Summary**: Checkout page with shipping & billing form
- **Payment Gateway**: Secure transactions via Cashfree Payment Gateway
- **Form Validation**: Robust validation implemented on login and signup pages.
- **State Management**: Efficient global state handling with Redux Toolkit.
- **Animations**: Smooth UI interactions and transitions using Framer Motion.
