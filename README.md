# Sri Murugan Tex – Textile Fabric Selling Website

## Overview

Sri Murugan Tex is a web-based textile fabric selling platform designed to provide a seamless and user-friendly shopping experience. The website enables users to explore various fabric categories, view detailed product information, and purchase fabrics efficiently.

A key feature of this project is the integration of an AI-based virtual try-on system that allows users to upload their image and preview fabrics on clothing using deep learning techniques.

---

## Features

### Product Browsing

* Browse a wide range of fabrics such as cotton, silk, linen, wool, velvet, and brocade
* Filter and search fabrics efficiently
* Categorized product listings

---

### Product Details

* View fabric images and descriptions
* Price per metre display
* Fabric specifications including width, weight, and stock availability
* Quantity selection with dynamic price calculation

---

### Cart and Checkout

* Add and remove items from cart
* View order summary
* Automatic total calculation
* Streamlined checkout process

---

### User Authentication

* Secure login and account creation
* Personalized user dashboard
* Order history tracking

---

### Loyalty Rewards System

* Earn points based on purchases
* Redeem points for discounts
* Track total spending and reward points

---

### Address Management

* Add and manage delivery addresses
* Save and reuse addresses
* Efficient checkout experience

---

### AI-Based Fabric Try-On (SegFormer Model)

This project includes an image-based virtual try-on feature powered by deep learning.

#### Working Principle

* The user uploads an image
* The system processes the image using a SegFormer-based semantic segmentation model
* The model identifies body regions, particularly clothing areas
* The selected fabric texture is mapped onto the segmented region
* A preview image is generated showing how the fabric appears on the user

#### Technologies Used

* SegFormer deep learning model for image segmentation
* Image processing techniques for texture mapping
* Node.js backend for handling image processing

#### Benefits

* Enables realistic fabric visualization
* Improves decision-making for users
* Enhances user interaction through AI integration

---

## Technology Stack

* Frontend: HTML, CSS, JavaScript / React
* Backend: Node.js
* AI Model: SegFormer (Deep Learning – Image Segmentation)
* Database: (if applicable – MongoDB or other)
* Additional Tools: Image processing libraries

---


## How to Run the Project

### 1. Clone the repository

```
git clone https://github.com/your-username/textile-website.git
cd textile-website
```

### 2. Install dependencies

```
npm install
```

### 3. Start the application

```
npm start
```

---

## Screens Overview

* Home page with featured fabrics
* Product listing and filtering
* Product detail view
* Cart and checkout interface
* User dashboard with order history
* Fabric try-on preview functionality

---

## Highlights

* Clean and responsive user interface
* Complete e-commerce workflow implementation
* Integration of AI-based fabric visualization
* Practical and user-focused design

---

## Future Enhancements

* Integration of payment gateway
* Admin dashboard for product management
* Improved accuracy of AI try-on model
* Mobile application development

---

## Conclusion

## Sri Murugan Tex provides a comprehensive solution for online textile shopping by combining modern web technologies with advanced AI capabilities. The integration of the SegFormer deep learning model for virtual try-on enhances the user experience by enabling realistic visualization of fabrics, making the platform efficient and innovative.
