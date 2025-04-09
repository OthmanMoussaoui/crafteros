document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const btnEnglish = document.getElementById('btn-english');
    const btnArabic = document.getElementById('btn-arabic');
    const arabicOptions = document.getElementById('arabic-options');
    const styleBtns = document.querySelectorAll('.style-btn');
    const eventDescription = document.getElementById('event-description');
    const btnSampleEvent = document.getElementById('btn-sample-event');
    const btnGenerate = document.getElementById('btn-generate');
    const resultContainer = document.getElementById('result-container');
    const commentaryContainer = document.getElementById('commentary-container');
    const commentaryText = document.getElementById('commentary-text');
    const btnTTS = document.getElementById('btn-tts');
    const audioContainer = document.getElementById('audio-container');
    const audioPlayer = document.getElementById('audio-player');

    // State
    let currentLanguage = 'english';
    let currentStyle = 'حماسي'; // Default Arabic style
    let sampleEvents = [];
    let currentCommentary = '';
    let currentEvent = '';

    // Initialize
    fetchSampleEvents();

    // Event Listeners
    btnEnglish.addEventListener('click', () => {
        setLanguage('english');
    });

    btnArabic.addEventListener('click', () => {
        setLanguage('arabic');
    });

    styleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setStyle(btn.dataset.style);
        });
    });

    btnSampleEvent.addEventListener('click', () => {
        loadRandomSampleEvent();
    });

    btnGenerate.addEventListener('click', () => {
        generateCommentary();
    });

    btnTTS.addEventListener('click', () => {
        generateAudio();
    });

    // Functions
    function setLanguage(language) {
        currentLanguage = language;
        
        // Update UI
        if (language === 'english') {
            btnEnglish.classList.remove('bg-gray-700');
            btnEnglish.classList.add('bg-green-600');
            btnArabic.classList.remove('bg-green-600');
            btnArabic.classList.add('bg-gray-700');
            arabicOptions.classList.add('hidden');
            commentaryContainer.removeAttribute('dir');
        } else {
            btnArabic.classList.remove('bg-gray-700');
            btnArabic.classList.add('bg-green-600');
            btnEnglish.classList.remove('bg-green-600');
            btnEnglish.classList.add('bg-gray-700');
            arabicOptions.classList.remove('hidden');
            commentaryContainer.setAttribute('dir', 'rtl');
        }
        
        // Hide results when switching language
        resultContainer.classList.add('hidden');
        audioContainer.classList.add('hidden');
    }

    function setStyle(style) {
        currentStyle = style;
        
        // Update UI
        styleBtns.forEach(btn => {
            if (btn.dataset.style === style) {
                btn.classList.remove('bg-gray-700');
                btn.classList.add('bg-green-600');
            } else {
                btn.classList.remove('bg-green-600');
                btn.classList.add('bg-gray-700');
            }
        });
    }

    function fetchSampleEvents() {
        fetch('/events')
            .then(response => response.json())
            .then(data => {
                sampleEvents = data.events;
            })
            .catch(error => {
                console.error('Error fetching sample events:', error);
            });
    }

    function loadRandomSampleEvent() {
        if (sampleEvents.length > 0) {
            const randomIndex = Math.floor(Math.random() * sampleEvents.length);
            const randomEvent = sampleEvents[randomIndex];
            eventDescription.value = randomEvent.description;
        }
    }

    function generateCommentary() {
        const event = eventDescription.value.trim();
        
        if (!event) {
            alert('Please enter an event description.');
            return;
        }
        
        currentEvent = event;
        
        // Show loading state
        btnGenerate.textContent = 'Generating...';
        btnGenerate.disabled = true;
        
        // Call API
        fetch('/generate_commentary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: event,
                language: currentLanguage,
                style: currentStyle
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.commentary) {
                currentCommentary = data.commentary;
                commentaryText.textContent = data.commentary;
                resultContainer.classList.remove('hidden');
                audioContainer.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Error generating commentary:', error);
            alert('Error generating commentary. Please try again.');
        })
        .finally(() => {
            btnGenerate.textContent = 'Generate Commentary';
            btnGenerate.disabled = false;
        });
    }

    function generateAudio() {
        if (!currentCommentary) {
            alert('Please generate commentary first.');
            return;
        }
        
        // Show loading state
        btnTTS.textContent = 'Generating...';
        btnTTS.disabled = true;
        
        // Call API
        fetch('/generate_audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentary: currentCommentary,
                event: currentEvent,
                language: currentLanguage,
                style: currentLanguage === 'arabic' ? currentStyle : null
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.audio_id) {
                audioPlayer.src = `/audio/${data.audio_id}`;
                audioContainer.classList.remove('hidden');
                audioPlayer.play();
            }
        })
        .catch(error => {
            console.error('Error generating audio:', error);
            alert('Error generating audio. Please try again.');
        })
        .finally(() => {
            btnTTS.innerHTML = '<i class="fas fa-headphones mr-2"></i> Generate Voice';
            btnTTS.disabled = false;
        });
    }
}); 