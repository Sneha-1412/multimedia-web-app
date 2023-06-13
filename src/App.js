import React, { useState, useEffect, useRef  } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer'; 
import { Pie, Bar } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 ArcElement,
 Tooltip,
 Legend
} from 'chart.js';
ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement
);
export default function App() {
 const [myFiles, setMyFiles] = useState([])
 const [selectedFile, setSelectedFile] = useState(null)
 const [filePath, setFilePath] = useState("/file-server/")
 const [showChartModal, setShowChartModal] = useState(false)
 const [fileUpload, setFileUpload] = useState(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [showDetails, setShowDetails] = useState(false);
 const fileInputRef = useRef(null);
 useEffect(() => {
  setMyFiles(data)
 }, [])

 useEffect(() => {
  if (fileUpload) {
    console.log('Uploaded file:', fileUpload);
    setFileUpload(null); 
  }
}, [fileUpload]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  setFileUpload(file);
};

const handleShowDetails = () => {
  setShowDetails(!showDetails);
};


const handleSearch = () => {
  const filteredFiles = data.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setMyFiles(filteredFiles);
};

const handleClearSearch = () => {
  setSearchQuery("");
  setMyFiles(data);
};

 var barChartOptions = {
  responsive: true,
  plugins: {
   legend: {
    position: 'top',
   },
   title: {
    display: true,
    text: 'Files Breakdown',
   },
  },
 };
 return (
  <>
   <div className="App">
   {showChartModal && (
    <div style={styles.modal}>
     <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
       <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
       <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
      </div>
      <div style={styles.modalBody}>
       <Pie
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
       />
       <Bar
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
        options={barChartOptions}
       />
       <input type="file" ref={fileInputRef} />
      <button onClick={handleFileUpload}>Upload</button> 
            </div>
     </div>
    </div>
   )}


  

<Header
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onChartClick={() => setShowChartModal(true)}
        />
    <div style={styles.container}>
     <div style={{ padding: 10, paddingBottom: 0, }}>
      <p style={{ fontWeight: "bold" }}>My Files</p>
      <p>{selectedFile ? selectedFile.path : filePath}</p>
     </div>
     <div style={styles.fileContainer}>
      <div style={{ width: "100%", padding: 10 }}>
      <div style={styles.controlTools}>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        name: prompt("Enter new name")
                      }
                    }
                    return file
                  })
                  setMyFiles(newFiles)
                  setSelectedFile(null)
                }
              }}
            >Rename</button>
            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true)
              }}
            >Files Breakdown</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile){
                  window.open(selectedFile.path, "_blank")
                }
              }}
            >Download</button>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.filter(
                    (file) => file.id !== selectedFile.id
                  );
                  setMyFiles(newFiles);
                  setSelectedFile(null);
                }
              }}
            >
              Delete
            </button>
            <input
  type="file"
  onChange={handleFileUpload}
  style={{ display: 'none' }}
  ref={fileInputRef}
/>

<input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
              />
              <button onClick={handleSearch}>Search</button>
              <button onClick={handleClearSearch}>Clear</button>

              <button
                style={styles.controlButton}
                onClick={handleShowDetails}
                disabled={!selectedFile}
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </button>
              {showDetails && selectedFile && (
                <div style={styles.fileDetails}>
                  <h3>File Details</h3>
                  <p>Name: {selectedFile.name}</p>
                  <p>Type: {selectedFile.type}</p>
                  <p>Size: {selectedFile.size} bytes</p>
                  
                </div>
              )}

          </div>
       {myFiles.map((file) => {
 
        if (file.path.slice(0, filePath.length) === filePath) {
         return (
          <div style={styles.file} className="files" key={file.id} onClick={() => {
           if (selectedFile && selectedFile.id === file.id) {
            setSelectedFile(null)
            return
           }
           setSelectedFile(file)
          }}>
           <p>{file.name}</p>
          </div>
         )
        }
       })}
      </div>
      {selectedFile && (
       <div style={styles.fileViewer}>
        {selectedFile.type === 'video' && (
         <VideoPlayer path={selectedFile.path} />
        )}
        {selectedFile.type === 'audio' && (
         <AudioPlayer path={selectedFile.path} />
        )}
        {selectedFile.type === 'document' && (
         <DocumentViewer path={selectedFile.path} />
        )}
        {selectedFile.type === 'image' && (
         <ImageViewer path={selectedFile.path} />
        )}
        <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
        <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
        <p>file type: <span style={{fontStyle: "italic"}}>{selectedFile.type}</span></p>
       </div>
 
      )}
     </div>
    </div>
   </div>
  </>
 );
}
 
const styles = {
 container: {
  backgroundColor: '#fff',
  color: '#000',
 },
 fileContainer: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'row',
 
 },
 file: {
  backgroundColor: '#eee',
  padding: '10px',
  marginBottom: '10px',
  cursor: 'pointer',
  width: '100%',
 },
 fileViewer: {
  padding: '10px',
  margin: '10px',
  width: '30vw',
  height: '100vh',
  cursor: 'pointer',
  borderLeft: '1px solid #000'
 },
 controlTools: {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
 },
 controlButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
 },
 // modal
 modal: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  padding: '20px',
  height: '50vh',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
},
modalClose: {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '10px',
  cursor: 'pointer',
},
modalBody:{
  width: '100%',
  height: '90%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
},
modalHeader: {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
},
closeButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  backgroundColor: '#eee',
},
fileDetails: {
  marginTop: 20,
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
}
};