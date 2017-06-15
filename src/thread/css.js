export const styleOn = (windowWidth) =>  {
  //if( windowWidth < 480 ){
  //if( windowWidth < 720 ){
    return {
      wall: {
        backgroundColor: '#fffff9',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      button: {
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 30px',
        borderStyle: 'none',
        backgroundColor:'#248',
        color: '#fff',
      },
      textarea: {
        fontSize: '18px',
        width: '100%',
        height: '30%',
        border: 'none',
      },
      wall2: {
        backgroundColor: '#666663',
        color: 'rgba(50, 0, 50, 0.87)',
        padding: '15px 15px 15px 15px',
      },
      timeline: {
        backgroundColor: '#fffff9',
        height: '60%',
        fontSize: '16px',
        padding: '0px',
      },
      nowToot: {
        padding: '10px 0px',
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: 'rgb(255, 255, 255)',
        transition: 'all 450ms cubicBezier(0.23, 1, 0.32, 1) 0ms',
        boxSizing: 'borderBox',
        fontFamily: 'Roboto, sansSerif',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
        borderRadius: '2px',
        zIndex: '1',
      },
      card: {
        padding: '0px',
        display: 'flex',
      },
      userleft: {
        width: '9%',
        listStyle: 'none',
        margin: '16px 0px 16px 0px',
        backgroundColor: '#'+Math.floor(Math.random()*parseInt('ffffff',16)).toString(16),
      },
      cardcenter: {
        width: '90%',
        listStyle: 'none',
        paddin: '5px',
      },
      linkOn: {
        width: '1%',
        backgroundColor: '#ddd',
        listStyle: 'none',
      },
      linkOff: {
        width: '1%',
        backgroundColor: '#fff',
        listStyle: 'none',
      },
      ln: {
        padding: '5px',
        margin: '0px',
      },
      button: {
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 30px',
        borderStyle: 'none',
        backgroundColor:'#248',
        color: '#fff',
      },
      textarea: {
        fontSize: '18px',
        width: '100%',
        height: '30%',
        border: 'none',
      },
      bar: {
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: 'rgb(0, 188, 212)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        boxSizing: 'border-box',
        fontFamily: 'Roboto, sans-serif',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
        borderRadius: '0px',
        position: 'fixed',
        zIndex: '9999',
        width: '100vw',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        overflow: 'hidden',
      },
      newTab: {
        width: '30px',
        height: '30px',
      },
      checkbox: {
        marginBottom: 16,
      },
    }
}
