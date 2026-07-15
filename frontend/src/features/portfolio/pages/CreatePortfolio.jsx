import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import usePortfolio from '../hooks/usePortfolio';
import Navbar from '../../../components/Navbar';

const FIELDS = ['Website', 'Mobile-app', 'Featured'];

const CreatePortfolio = () => {
    const navigate = useNavigate();
    const { loading, handleCreatePortfolio } = usePortfolio();

    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [description, setDescription] = useState('');
    const [field, setField] = useState('Website');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
        setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subTitle', subTitle);
        formData.append('description', description);
        formData.append('field', field);
        images.forEach((img) => formData.append('images', img));

        const success = await handleCreatePortfolio(formData);
        if (success) navigate('/user/dashboard');
    };

    return (
        <div className='position-relative'>
            <Navbar />

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">

                        <div className="mb-5">
                            <p className="text-secondary mb-1" style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Portfolio</p>
                            <h2 className="fw-semibold mb-1" style={{ fontSize: 'calc(22px + 0.8vw)' }}>Add New Project</h2>
                            <p className="text-secondary" style={{ fontSize: '15px' }}>Fill in the details below to showcase your work.</p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* Images */}
                            <div className="mb-4">
                                <label className="form-label fw-medium mb-2">Project Images</label>
                                <div
                                    className="border rounded-3 p-4 text-center"
                                    style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'rgba(0,0,0,0.01)' }}
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    <i className="ti ti-photo-up" style={{ fontSize: '28px', opacity: 0.4 }}></i>
                                    <p className="mb-0 mt-2 text-secondary" style={{ fontSize: '14px' }}>
                                        Click to upload images <span style={{ opacity: 0.6 }}>(multiple allowed)</span>
                                    </p>
                                    <input
                                        type="file"
                                        id="imageInput"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="position-relative" style={{ width: '90px', height: '90px' }}>
                                                <img
                                                    src={src}
                                                    alt={`preview-${index}`}
                                                    className="rounded-2 object-fit-cover w-100 h-100"
                                                    style={{ border: '1px solid #eee' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="position-absolute top-0 end-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '22px', height: '22px', background: '#ff4d4f', color: '#fff', fontSize: '12px', transform: 'translate(30%, -30%)' }}
                                                >
                                                    <i className="ti ti-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Field */}
                            <div className="mb-4">
                                <label className="form-label fw-medium mb-2">Category</label>
                                <div className="d-flex gap-2 flex-wrap">
                                    {FIELDS.map((f) => (
                                        <button
                                            type="button"
                                            key={f}
                                            onClick={() => setField(f)}
                                            className="px-3 py-2 rounded-3 border fw-medium"
                                            style={{
                                                fontSize: '14px',
                                                background: field === f ? '#000' : 'transparent',
                                                color: field === f ? '#fff' : 'inherit',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SubTitle */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-medium mb-0">Subtitle</label>
                                    <span className="text-secondary" style={{ fontSize: '12px' }}>{subTitle.length}/30</span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. UI/UX Design"
                                    value={subTitle}
                                    onChange={(e) => setSubTitle(e.target.value)}
                                    maxLength={30}
                                    required
                                />
                            </div>

                            {/* Title */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-medium mb-0">Title</label>
                                    <span className="text-secondary" style={{ fontSize: '12px' }}>{title.length}/100</span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Truvista Mobile Banking App"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={100}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-5">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-medium mb-0">Description</label>
                                    <span className={`${description.length >= 380 ? 'text-danger' : 'text-secondary'}`} style={{ fontSize: '12px' }}>{description.length}/400</span>
                                </div>
                                <textarea
                                    className="form-control"
                                    placeholder="Describe your project, process, and outcome..."
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={400}
                                    required
                                />
                            </div>

                            {/* Actions */}
                            <div className="d-flex gap-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-dark px-5"
                                    disabled={loading || !field}
                                >
                                    {loading ? 'Publishing...' : 'Publish Project'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePortfolio;