export const styleOn = (windowWidth) =>  {
  //if( windowWidth < 480 ){
  //if( windowWidth < 720 ){
    return {
      wall: {
        backgroundColor: '#fffff9',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      nowToot: {
        padding: '10px',
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
        margin: '0',
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
      checkbox: {
        marginBottom: 16,
      },
      toot: {
        backgroundColor: '#fffff9',
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'block',
        textAlign: 'center',
        width: '90%',
        marginLeft: '5vw',
      },
      textarea: {
        fontSize: '16px',
        height: '40px',
        width: '85%',
        border: 'none',
        paddingLeft: '0',
        position: 'relative',
        display: 'block',
        marginTop: '0em',
        margin: '0px',
      },
      button: {
        width: '40px',
        height: '40px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderStyle: 'none',
        background: 'none',
        //backgroundColor:'#ffdb58',
        color: '#fff',
        display: 'flex',
        borderRadius: '0',
        padding: '0',
        margin: '3px 0px 0px 0px',
        position: 'absolute',
        right: '0',
        top: '0',
      },
      emoji: {
        width:'100%',
        height:'100%',
      },

    }
}
