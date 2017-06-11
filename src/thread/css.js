export const styleOn = (windowWidth) =>  {
  //if( windowWidth < 480 ){
  if( windowWidth < 720 ){
    return {
      wall: {
        backgroundColor: '#fffff9',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      timeline: {
        backgroundColor: '#fffff9',
        height: '60%',
        fontSize: '16px',
        padding: '0px',
      },
      card: {
        padding: '0px',
        display: 'flex',
      },
      text: {
        width: '99%',
        listStyle: 'none',
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
  }else{
    return {
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
        width: '100%',
        height: '100px',
        display: 'flex',
        paddingLeft: '24px',
        paddingRight: '24px',
        bottom: 0,
      },
      timeline: {
        height: '60%',
      },
      post: {
        height: '30%',
      },
      button: {
        fontSize: '1.4em',
        fontWeight: 'bold',
        padding: '10px 30px',
        borderStyle: 'none',
        backgroundColor:'#248',
        color: '#fff',
      },
      textarea: {
        fontSize: '1.8em',
        width: '100%',
        height: '30%',
      },
      newTab: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'none',
        margin: '0 auto',
      },
    }
  }
}
