export const styleOn = (windowWidth) =>  {
  //if( windowWidth < 480 ){
  //if( windowWidth < 720 ){
    return {
      wallpaper: {
        height: '100vh',
        width: '100vw',
      },
      toot: {
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'block',
        background: 'none',
        textAlign: 'center',
        margin: '30vh 10% 0% 10%',
      },
      textarea: {
        fontSize: '16px',
        height: '40px',
        width: '85%',
        paddingLeft: '0',
        position: 'relative',
        background: 'none',
        display: 'block',
        marginTop: '0em',
        margin: '0px',
        borderStyle: 'none',
      },
      button: {
        width: '40px',
        height: '40px',
        fontSize: '16px',
        fontWeight: 'bold',
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
