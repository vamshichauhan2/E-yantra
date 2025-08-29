import './coordinator.css'
const eYantraCoordinator = {
  name: "Dr. Tejavathu Ramesh",
  designation: "Faculty Coordinator",
  email: "tramesh.ee@nitandhra.ac.in",
  phone: "+91-XXXXXXXXXX",
  office: "Electrical Engineering Department, NIT Andhra Pradesh"
};

const CoordinatorDetails = () => (
    <div className='club-coordinator'>
        <div className='club-coordinator-Image-and-Name-container' style={{margin:0,padding:0}}>
             <img className="club-coordinator-Image" src="./clubCoordinator.jpg" alt="Dr. Tejavathu Ramesh"/>
             <p className='club-cooradinator-name'>Dr. Tejavathu Ramesh</p>


        </div>
     
  <div className="coordinator-details">
    
    <p className='coordinator-name'><strong className='strong-letter'>Name:</strong> {eYantraCoordinator.name}</p>
    <p  className='coordinator-name'><strong className='strong-letter'>Designation:</strong> {eYantraCoordinator.designation}</p>
    <p  className='coordinator-name'><strong className='strong-letter'>Email:</strong> <a href={`mailto:${eYantraCoordinator.email}`}>{eYantraCoordinator.email}</a></p>
    <p  className='coordinator-name'><strong className='strong-letter'>Phone:</strong> {eYantraCoordinator.phone}</p>
    <p  className='coordinator-name'><strong className='strong-letter'>Office:</strong> {eYantraCoordinator.office}</p>
  </div>
  </div>
);

export default CoordinatorDetails;
