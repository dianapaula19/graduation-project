import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { PLACEHOLDER } from "components/Utils";
import "./DropDown.scss";
import { DropDownModifier, IDropDownProps } from "./DropDown.types";


const DropDown = ({
  label,
  modifier,
  error,
  errorMessage,
  placeholder,
  id,
  children,
  ...rest
}: IDropDownProps) => {

  const componentClassName = "dropdown";
  const errorGroupClassName = `${componentClassName}--${DropDownModifier.error}__error-group`;

  const componentClassNames = classNames(
    componentClassName,
    modifier && `${componentClassName}--${modifier}`,
    error && `${componentClassName}--${DropDownModifier.error}`
  );

  return (
    <div className={componentClassNames}>
      <label 
        htmlFor={id}
        className={`${componentClassName}__label`}
      >
        {label}
      </label>
      <select
        id={id}
        className={classNames(
          `${componentClassName}__select`
        )}
        {...rest}
      >   
        {rest.value === PLACEHOLDER && (
          <option 
            hidden 
            disabled 
            selected 
            value={PLACEHOLDER}
          >
            {placeholder}
          </option>
        )}
        {children}
      </select>   
      { error && (
        <div className={errorGroupClassName}>
          <FontAwesomeIcon 
            icon={faXmark} 
            className={`${errorGroupClassName}__icon`}
          />
          <span className={`${errorGroupClassName}__span`}>
            {errorMessage}
          </span>
        </div>
      ) }
    </div>
  )
}

export default DropDown;