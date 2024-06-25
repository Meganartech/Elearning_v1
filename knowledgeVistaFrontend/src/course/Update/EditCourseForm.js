import React, { useState, useEffect } from "react";
import "../../css/CreateApplication.css"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import baseUrl from "../../api/utils";
import axios from "axios";
const EditCourseForm = ({ id, toggleEditMode }) => {
  const MySwal = withReactContent(Swal);
  const  courseId=id
  const token =sessionStorage.getItem("token")
  const [courseEdit, setCourseEdit] = useState([
   
  ]);
  const [img, setimg] = useState();
  useEffect(() => {
    const fetchcourse = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/course/get/${id}`,
          {
            headers: {
              Authorization: token
          },
          }
        );
        if (!response.status===200) {
          MySwal.fire({
            icon: "error",
            title: "HTTP Error!",
            text: `HTTP error! Status: ${response.status}`,
          });
        }
        const data =  response.data;
        setimg(`data:image/jpeg;base64,${data.courseImage}`);
        setCourseEdit(data);
      } catch (error) {
        MySwal.fire({
          title: "Error!",
          text: "An error occurred while Fetching course in Edit Form. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchcourse();
  }, [courseId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseEdit({ ...courseEdit, [name]: value });
  };

  // Function to convert file to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    // Update formData with the new file
    const file = e.target.files[0];

    // Convert the file to base64

    // Update formData with the new file
    setCourseEdit((courseEdit) => ({ ...courseEdit, courseImage: file }));
    convertImageToBase64(file)
      .then((base64Data) => {
        // Set the base64 encoded image in the state
        setimg(base64Data);
      })
      .catch((error) => {
        console.error("Error converting image to base64:", error);
      });
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    if (courseEdit.courseName) {
      formData.append("courseName", courseEdit.courseName);
    }
    if (courseEdit.courseDescription) {
      formData.append("courseDescription", courseEdit.courseDescription);
    }
    if (courseEdit.amount) {
      formData.append("courseAmount", courseEdit.amount);
    }
    if (courseEdit.courseCategory) {
      formData.append("courseCategory", courseEdit.courseCategory);
    }
    if (courseEdit.courseImage) {
      formData.append("courseImage", courseEdit.courseImage);
    }
    if (courseEdit.duration) {
      formData.append("Duration", courseEdit.duration);
    }
    if (courseEdit.noofseats) {
      formData.append("Noofseats", courseEdit.noofseats);
    }

    e.preventDefault();
    try {
      const response = await axios.patch(
        `${baseUrl}/course/edit/${courseId}`,
        formData,
        {
            headers: {
                Authorization: token
            },
        }
    );

      if (response.status===200) {
        MySwal.fire({
          title: "Course Updated",
          text: " course have Updated successfully you can check by refreshing !",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/dashboard/course";
          }   });
      
      }
    } catch (error) {
      // Handle network errors or other exceptions
      MySwal.fire({
        title: "Error!",
        text: "An error occurred . Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="contentbackground">
    <form onSubmit={handleSubmit}>
      <div className="contentinner">
      <div className="outer " >
        <div className="first">
          <div className="head">
            <h2 className="heading ">Update Course</h2>
            <h6>
              <a onClick={toggleEditMode} className="btn btn-primary">
                <i className="fa fa-times" aria-hidden="true"></i>{" "}
              </a>
            </h6>
          </div>
          <div className="form-group">
            <label htmlFor="courseName" >
              Course Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="courseName"
              id="courseName"
              className="form-control "
              placeholder="Enter the Course Name"
              value={courseEdit.courseName}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="courseDescription" >
              Course Description <span className="text-danger">*</span>
            </label>
            <textarea
              name="courseDescription"
              id="courseDescription"
              rows={5}
              className="form-control "
              placeholder="Description about the Course"
              value={courseEdit.courseDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courseCategory" >
              Course Category <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="courseCategory"
              id="courseCategory"
              className="form-control "
              placeholder="Category"
              value={courseEdit.courseCategory}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group ">
                <label htmlFor="noofseats">No of Seats <span className="text-danger">*</span></label>
                <input
                  name="noofseats"
                  type="number"
                  id="doofseats"
                  className="form-control "
                  value={courseEdit.noofseats}
                  onChange={handleChange}
                  required
                />
              </div>
          
        </div>
        <div ></div>
        <div className="second">
          <div className="form-group">
            <label htmlFor="courseImage" >
              <h2>Course Image <span className="text-danger">*</span></h2>
            </label>
            <input
              type="file"
              name="courseImage"
              id="courseImage"
              accept="image/jpeg, image/png, image/gif"
              placeholder="Upload Image"
              onChange={handleFileChange}
            />{" "}
            <br />
            {/* Display the image */}
            <img
              src={img}
              alt="selected pic of course"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                alignItems: "center",
              }}
            />
            <br />
            <div className="form-group mt-1">
            <label htmlFor="courseAmount" >
             Amount <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="form-control "
              placeholder="Amount"
              value={courseEdit.amount} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mt-1">
                <label htmlFor="duration">Course Duration <span className="text-danger">*</span></label>
                <input
                  name="duration"
                  type="number"
                  id="duration"
                  className="form-control "
                  value={courseEdit.duration}
                  onChange={handleChange}
                  required
                />
              </div>
          
            <div>
              <button type="submit" className="btn btn-primary w-100">
                Update Course
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </form>
  </div>
  );
};

export default EditCourseForm;
