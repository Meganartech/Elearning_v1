import React, { useEffect, useState } from 'react';
import baseUrl from '../api/utils';
import axios from 'axios';

const MyCertificateList = () => {
    const [myCertificates, setMyCertificates] = useState([]);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const certificateData = await axios.get(`${baseUrl}/certificate/getAllCertificate`, {
                    headers: {
                        Authorization: token
                    }
                });
                if (certificateData.status===200) {
                    const certificateJson =  certificateData.data;
                    setMyCertificates(certificateJson);
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
            }
        };
        fetchCertificates();
    }, []);

    return (
        <div className='contentbackground'>
            <div className='contentinner'>
        <div className="mt-4">
            <h2>My Certificates</h2>
            <table className="table table-hover table-bordered table-sm ">
                <thead className='thead-dark'>
                    <tr>
                        <th scope="col" >S.No</th>
                        <th scope="col" >Course Name</th>
                        <th scope="col" >Percentage</th>
                        <th scope="col" >Test Date</th>
                        <th scope="col" >Certificate</th>
                    </tr>
                </thead>
                <tbody>
                {  myCertificates.map((certificate, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{certificate.course}</td>
                            <td>{certificate.percentage}</td>
                            <td>{certificate.testDate}</td>
                            <td><a href={`/template/${certificate.activityId}`}><i className="fa-solid fa-download text-primary"></i></a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
        </div>
    );
};

export default MyCertificateList;
