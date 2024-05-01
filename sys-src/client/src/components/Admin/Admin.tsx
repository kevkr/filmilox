import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useState, useEffect, ChangeEvent } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useNavigate } from 'react-router-dom';
import Backend from '../../api/Backend';

const Admin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitel] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [releaseDate, setReleaseDate] = useState<Date>(new Date());
    const [trailerLink, setTrailerLink] = useState<string>('');
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>('');
    const [showFileTypeErr, setShowFileTypeErr] = useState<boolean>(false);
    const [showImgSizeErr, setShowImgSizeTypeErr] = useState<boolean>(false);
    const [showAddMovieError, setShowAddMovieError] = useState<boolean>(false);
    const [showAddMovieSuccess, setShowAddMovieSuccess] =
        useState<boolean>(false);
    let formValid: boolean = false;

    // validation states
    const [titleError, setTitelError] = useState({
        status: false,
        helperText: '',
    });
    const [descriptionError, setDescriptionError] = useState({
        status: false,
        helperText: '',
    });
    const [trailerError, setTrailerError] = useState({
        status: false,
        helperText: '',
    });

    // errors for image
    const FileTypeErr = () => (
        <p
            className="text-red-600 border-solid border-2 rounded-md border-red-600 p-2 -translate-y-6"
            data-testid="FileTypeErr"
        >
            Invalid image filetype! (Accepted filetypes: .png / .jpg)
        </p>
    );
    const ImgSizeErr = () => (
        <p
            className="text-red-600 border-solid border-2 rounded-md border-red-600 p-2 -translate-y-6"
            data-testid="ImgSizeErr"
        >
            Image too small! (Accepted size: min. 400x600 pixel)
        </p>
    );

    // error/success on movieAdd
    const AddMovieSuccess = () => (
        <p
            className="text-lime-500 text-lg font-semibold border-solid border-2 rounded-md border-lime-500 p-2 text-center w-full"
            data-testid="uploadSuccess"
        >
            Added movie!
        </p>
    );
    const AddMovieError = () => (
        <p
            className="text-red-600 text-lg font-semibold border-solid border-2 rounded-md border-red-600 p-2 text-center w-full"
            data-testid="uploadError"
        >
            Failed to add movie!
        </p>
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAddMovieSuccess(false);
            setShowAddMovieError(false);
        }, 7000);
        return () => clearTimeout(timer);
    }, [showAddMovieError, showAddMovieSuccess]);

    useEffect(() => {
        if (image) {
            //load file and set preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(image);

            // read File as image and validate
            reader.onload = function (theFile) {
                var image = new Image();
                image.src = theFile?.target?.result as string;
                image.onload = function () {
                    validateImageSize(image);
                };
            };
        } else {
            setPreview('');
        }
    }, [image]);

    function validate() {
        formValid = true;

        // Reset Errors:
        setTitelError({
            status: false,
            helperText: '',
        });
        setDescriptionError({
            status: false,
            helperText: '',
        });
        setTrailerError({
            status: false,
            helperText: '',
        });

        // Validate Inputs:
        // leerer Titel
        if (title === '') {
            setTitelError({
                status: true,
                helperText: 'Title must not be empty.',
            });
            formValid = false;
        }
        // Beschreibung darf nicht leer sein
        if (description.length === 0) {
            setDescriptionError({
                status: true,
                helperText: 'Description must not be empty.',
            });
            formValid = false;
        }
        // trailer Link leer
        if (trailerLink === '') {
            setTrailerError({
                status: true,
                helperText: 'Trailer-Link must not be empty.',
            });
            formValid = false;
        }

        if (showImgSizeErr === true || showFileTypeErr === true) {
            formValid = false;
        }
    }

    function handleTitleChange(title: string) {
        setTitel(title);
    }

    function handleDescriptionChange(description: string) {
        setDescription(description);
    }

    const handleDateChange = (newValue: Date | null) => {
        if (newValue !== null) setReleaseDate(newValue);
    };

    function handleTLinkChange(tlink: string) {
        setTrailerLink(tlink);
    }

    function handlePosterUpload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files![0];
        if (file != null && validateImageType(file)) {
            setImage(event.target.files![0]);
        }
    }

    function validateImageSize(image: HTMLImageElement) {
        if (image.height >= 600 && image.width >= 400) {
            setShowImgSizeTypeErr(false);
        } else {
            setShowImgSizeTypeErr(true);
        }
    }

    function validateImageType(file: File): boolean {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            setShowFileTypeErr(false);
            return true;
        } else {
            setShowFileTypeErr(true);
            return false;
        }
    }

    async function handleAddMovie() {
        validate();
        if (formValid) {
            try {
                setLoading(true);
                var formData = new FormData();

                formData.append('file', image as Blob);
                formData.append('title', title);
                formData.append('description', description);
                formData.append('releaseDate', releaseDate.toDateString());
                formData.append('trailer', trailerLink);

                const status = await Backend.addMovie(formData);
                setLoading(false);

                if (status) {
                    setTitel('');
                    setDescription('');
                    setTrailerLink('');
                    setImage(undefined);
                    setShowAddMovieSuccess(true);
                    setShowAddMovieError(false);
                } else {
                    setShowAddMovieSuccess(false);
                    setShowAddMovieError(true);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const Input = styled('input')({
        display: 'none',
    });

    const handleNavigate = (route: string) => {
        navigate(route);
    };

    return (
        <>
            <div className="w-[600px] mx-auto flex flex-col flex-wrap items-center space-y-10 justify-between ">
                <h1
                    className="font-medium text-left leading-tight text-5xl w-[125%] mt-3"
                    data-testid="heading"
                >
                    Add movie:
                </h1>
                <TextField
                    data-testid="titleInput"
                    label="Title"
                    variant="outlined"
                    className="scale-125 w-[100%]"
                    type="text"
                    value={title}
                    error={titleError.status}
                    helperText={titleError.helperText}
                    onChange={(event) => {
                        handleTitleChange(event.target.value);
                    }}
                />
                <TextField
                    data-testid="descriptionInput"
                    label="Description"
                    multiline
                    rows={7}
                    value={description}
                    error={descriptionError.status}
                    helperText={descriptionError.helperText}
                    sx={{ paddingTop: 1, paddingBottom: 2 }}
                    className="scale-125 w-[100%]"
                    type="text"
                    onChange={(event) => {
                        handleDescriptionChange(event.target.value);
                    }}
                />
                <DesktopDatePicker
                    label="Release date"
                    inputFormat="MM/dd/yyyy"
                    value={releaseDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                        <TextField
                            className="scale-125 w-[100%]"
                            {...params}
                            data-testid="datePicker"
                        />
                    )}
                />
                <TextField
                    data-testid="linkInput"
                    label="Trailer-Link"
                    variant="outlined"
                    className="scale-125 w-[100%]"
                    type="text"
                    value={trailerLink}
                    error={trailerError.status}
                    helperText={trailerError.helperText}
                    onChange={(event) => {
                        handleTLinkChange(event.target.value);
                    }}
                />

                <label
                    htmlFor="contained-button-file"
                    className="mx-auto scale-125 "
                >
                    <Input
                        data-testid="addImgInput"
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        onChange={(event) => {
                            handlePosterUpload(event);
                        }}
                    />
                    <Button
                        data-testid="addImgButton"
                        variant="contained"
                        component="span"
                        startIcon={<InsertPhotoIcon />}
                    >
                        Add movie cover
                    </Button>
                </label>
                <img src={preview} className="w-[300px]" alt="" />
                {showFileTypeErr ? <FileTypeErr /> : null}
                {showImgSizeErr ? <ImgSizeErr /> : null}

                <div className="w-[115%]" style={{ marginTop: 70 }}>
                    <LoadingButton
                        data-testid="addMovieBtn"
                        color="primary"
                        onClick={handleAddMovie}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<AddIcon />}
                        variant="contained"
                        className="scale-125 float-left"
                    >
                        Add movie
                    </LoadingButton>
                    <Button
                        data-testid="cancelBtn"
                        variant="outlined"
                        className="scale-125 float-right"
                        onClick={() => handleNavigate('/')}
                    >
                        Cancel
                    </Button>
                </div>
                {showAddMovieSuccess ? <AddMovieSuccess /> : null}
                {showAddMovieError ? <AddMovieError /> : null}
                <div style={{ marginBottom: 100 }}></div>
            </div>
        </>
    );
};

export default Admin;
