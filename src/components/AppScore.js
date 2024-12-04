import './_css/AppScore.css';

export default function AppScore() {

    return (
        <section className='score-section'>
            <div className='scorebox'>
                <div className='name'> BEST </div>
                <div className='score'> 100 </div>
            </div>
            <div className='scorebox'>
                <div className='name'> NEON </div>
                <div className='score'> 200 </div>
            </div>
        </section>
    );
}
