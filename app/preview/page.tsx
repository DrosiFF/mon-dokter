'use client'

export default function PhonePreview() {
  const navigateToPage = (path: string) => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement
    if (iframe) {
      iframe.src = `http://localhost:3000${path}`
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#111",
      padding: "20px"
    }}>
      <div style={{
        width: "375px",   // iPhone X width
        height: "812px",  // iPhone X height
        border: "12px solid #333",
        borderRadius: "36px",
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(0,0,0,0.7)",
        background: "white",
        position: "relative"
      }}>
        {/* iPhone notch */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "150px",
          height: "30px",
          background: "#333",
          borderRadius: "0 0 20px 20px",
          zIndex: 10
        }} />
        
        {/* Home indicator */}
        <div style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "134px",
          height: "5px",
          background: "#333",
          borderRadius: "3px",
          zIndex: 10
        }} />
        
        <iframe
          src="http://localhost:3000"
          style={{ 
            width: "100%", 
            height: "100%", 
            border: "none",
            borderRadius: "24px"
          }}
          title="MON DOKTER Mobile Preview"
        />
      </div>
      
      {/* Preview info */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        color: "white",
        fontFamily: "system-ui, sans-serif"
      }}>
        <h2 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>MON DOKTER Mobile Preview</h2>
        <p style={{ margin: "0", opacity: "0.8", fontSize: "14px" }}>iPhone X Simulation (375x812)</p>
        <p style={{ margin: "5px 0 0 0", opacity: "0.6", fontSize: "12px" }}>
          Testing responsive design for Seychelles healthcare platform
        </p>
      </div>
      
      {/* Navigation buttons */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        <button
          onClick={() => navigateToPage('')}
          style={{
            padding: "8px 16px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          Home
        </button>
        <button
          onClick={() => navigateToPage('/search')}
          style={{
            padding: "8px 16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
        <button
          onClick={() => navigateToPage('/pharmacy')}
          style={{
            padding: "8px 16px",
            background: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          Pharmacy
        </button>
        <button
          onClick={() => navigateToPage('/doctor/dr-mario-rossi')}
          style={{
            padding: "8px 16px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          Doctor
        </button>
      </div>
    </div>
  );
}
