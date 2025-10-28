import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

interface PartDetails {
  part_detail_id: number;
  isSelected: boolean;
  supplier: string;
  quality: string;
  cost_part: number;
  discount_part: string;
  vat_part: string;
  part_total: string;
}

interface LabourDetails {
  part_detail_id: number;
  eor_or_surveyor: string;
  activity: string;
  number_of_hours: string;
  hourly_cost_labour: string;
  discount_labour: string;
  vat_labour: string;
  labour_total: string;
}

interface AdditionalLabour {
  eor_or_surveyor: string;
  painting_cost: string;
  painting_materiels: string;
  sundries: string;
  num_of_repaire_days: number;
  discount_add_labour: string;
  vat: string;
  add_labour_total: string;
}

interface SparePart {
  name: string;
  quantity: number;
  part_details: PartDetails[];
  labour_details: LabourDetails[];
}

@Component({
  selector: 'app-claims-repaire',
  templateUrl: './claims-repaire.component.html',
  styleUrls: ['./claims-repaire.component.scss'],
  imports: [MatIconModule, ReactiveFormsModule, CommonModule],
  providers: [CurrencyPipe],
})
export class ClaimsRepaireComponent {
  @Input() repaireInfo: any;
  @Input() additionalLabourInfo: any;
  @Output() formSubmitted = new EventEmitter<any>();

  repairForm: FormGroup;
  formSubmittedAttempt = false;
  activeTabs: Map<number, number> = new Map();
  editingPartIndex: number | null = null;
  editMode: 'name' | 'quantity' | null = null;

  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.repairForm = this.createForm();
  }

  ngOnInit() {
    if (this.repaireInfo) {
      this.patchFormValues();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      spareParts: this.fb.array([]),
      additional_labour_details: this.fb.array([]),
      remarks: [''],
    });
  }

  get spareParts(): FormArray {
    return this.repairForm.get('spareParts') as FormArray;
  }

  createSparePart(partData: SparePart): FormGroup {
    // Créer 4 lignes vides pour part_details
    const partDetails = Array(4)
      .fill(null)
      .map((_, index) => {
        const existingDetail = partData?.part_details?.[index];
        return existingDetail
          ? {
              part_detail_id: existingDetail.part_detail_id || 0,
              isSelected: [index === 0],
              supplier: existingDetail.supplier || '',
              quality: existingDetail.quality || '',
              cost_part: existingDetail.cost_part || 0,
              discount_part: existingDetail.discount_part || '0.00',
              vat_part: existingDetail.vat_part || '',
              part_total: existingDetail.part_total || '0.00',
            }
          : {
              part_detail_id: 0,
              isSelected: [index === 0],
              supplier: '',
              quality: '',
              cost_part: 0,
              discount_part: '0.00',
              vat_part: '',
              part_total: '0.00',
            };
      });

    // Créer 4 lignes vides pour labour_details
    const labourDetails = Array(2)
      .fill(null)
      .map((_, index) => {
        const existingLabour = partData?.labour_details?.[index];
        return existingLabour
          ? {
              part_detail_id: existingLabour.part_detail_id || 0,
              eor_or_surveyor: existingLabour.eor_or_surveyor || 'EOR',
              activity: existingLabour.activity || '',
              number_of_hours: existingLabour.number_of_hours || '0.00',
              hourly_cost_labour: existingLabour.hourly_cost_labour || '0.00',
              discount_labour: existingLabour.discount_labour || '0.00',
              vat_labour: existingLabour.vat_labour || '15',
              labour_total: existingLabour.labour_total || '0.00',
            }
          : {
              part_detail_id: 0,
              eor_or_surveyor: 'Surveyor',
              activity: '',
              number_of_hours: '0.00',
              hourly_cost_labour: '0.00',
              discount_labour: '0.00',
              vat_labour: '15',
              labour_total: '0.00',
            };
      });

    return this.fb.group({
      name: [partData?.name || '', Validators.required],
      isSelected: [true],
      quantity: [
        partData?.quantity || 1,
        [Validators.required, Validators.min(1)],
      ],
      part_details: this.fb.array(
        partDetails.map((detail: any, index: number) =>
          this.fb.group({
            isSelected: [detail.isSelected],
            supplier: [{ value: detail.supplier, disabled: index === 0 }],
            quality: [{ value: detail.quality, disabled: index === 0 }],
            cost_part: [{ value: detail.cost_part, disabled: index === 0 }],
            discount_part: [detail.discount_part],
            vat_part: [detail.vat_part],
            part_total: [detail.part_total],
          })
        )
      ),
      labour_details: this.fb.array(
        labourDetails.map((labour: any, index: number) =>
          this.fb.group({
            eor_or_surveyor: [
              { value: labour.eor_or_surveyor, disabled: index === 0 },
            ],
            activity: [labour.activity, index === 1 && Validators.required],
            number_of_hours: [
              labour.number_of_hours,
              index === 1 && [Validators.required, Validators.min(0)],
            ],
            hourly_cost_labour: [
              labour.hourly_cost_labour,
              index === 1 && [Validators.required, Validators.min(0)],
            ],
            discount_labour: [
              labour.discount_labour,
              index === 1 && [Validators.min(0)],
            ],
            vat_labour: [
              labour.vat_labour,
              index === 1 && [Validators.min(0), Validators.max(100)],
            ],
            labour_total: [labour.labour_total],
          })
        )
      ),
    });
  }

  private patchFormValues(): void {
    // Clear existing parts
    while (this.spareParts.length !== 0) {
      this.spareParts.removeAt(0);
    }

    // Add parts from input data
    this.repaireInfo.forEach((part: SparePart) => {
      this.spareParts.push(this.createSparePart(part));
    });

    // Add additional labour details from input data
    if (this.additionalLabourInfo) {
      this.additionalLabourInfo.forEach(
        (labour: AdditionalLabour, index: number) => {
          this.additionalLabourDetails.push(
            this.createAdditionalLabour(labour, index)
          );
        }
      );
    }

    // Add default additional labour if empty
    if (this.additionalLabourDetails.length === 0) {
      this.additionalLabourDetails.push(this.createAdditionalLabour());
      this.additionalLabourDetails.push(
        this.createAdditionalLabour({
          eor_or_surveyor: 'Surveyor',
          painting_cost: '0',
          painting_materiels: '0',
          sundries: '0',
          num_of_repaire_days: 0,
          discount_add_labour: '0',
          vat: '15',
          add_labour_total: '0',
        })
      );
    }

    // Add change listeners to recalculate totals
    this.spareParts.controls.forEach((partGroup, partIndex) => {
      this.activeTabs.set(partIndex, 0);
      const partDetailsArray = partGroup.get('part_details') as FormArray;
      partDetailsArray.controls.forEach((detailGroup, detailIndex) => {
        detailGroup
          .get('cost_part')
          ?.valueChanges.subscribe(() =>
            this.calculatePartTotal(partIndex, detailIndex)
          );
        detailGroup
          .get('discount_part')
          ?.valueChanges.subscribe(() =>
            this.calculatePartTotal(partIndex, detailIndex)
          );
        detailGroup
          .get('vat_part')
          ?.valueChanges.subscribe(() =>
            this.calculatePartTotal(partIndex, detailIndex)
          );
      });

      const labourDetailsArray = partGroup.get('labour_details') as FormArray;
      labourDetailsArray.controls.forEach((labourGroup, labourIndex) => {
        labourGroup
          .get('number_of_hours')
          ?.valueChanges.subscribe(() =>
            this.calculateLabourTotal(partIndex, labourIndex)
          );
        labourGroup
          .get('hourly_cost_labour')
          ?.valueChanges.subscribe(() =>
            this.calculateLabourTotal(partIndex, labourIndex)
          );
        labourGroup
          .get('discount_labour')
          ?.valueChanges.subscribe(() =>
            this.calculateLabourTotal(partIndex, labourIndex)
          );
        labourGroup
          .get('vat_labour')
          ?.valueChanges.subscribe(() =>
            this.calculateLabourTotal(partIndex, labourIndex)
          );
      });
    });

    this.additionalLabourDetails.controls.forEach((labourGroup, index) => {
      labourGroup
        .get('painting_cost')
        ?.valueChanges.subscribe(() =>
          this.calculateAdditionalLabourTotalPerItem(index)
        );
      labourGroup
        .get('painting_materiels')
        ?.valueChanges.subscribe(() =>
          this.calculateAdditionalLabourTotalPerItem(index)
        );
      labourGroup
        .get('sundries')
        ?.valueChanges.subscribe(() =>
          this.calculateAdditionalLabourTotalPerItem(index)
        );
      labourGroup
        .get('discount_add_labour')
        ?.valueChanges.subscribe(() =>
          this.calculateAdditionalLabourTotalPerItem(index)
        );
      labourGroup
        .get('vat')
        ?.valueChanges.subscribe(() =>
          this.calculateAdditionalLabourTotalPerItem(index)
        );

      // Calcul initial
      this.calculateAdditionalLabourTotalPerItem(index);
    });
  }

  private createAdditionalLabour(
    labourData?: AdditionalLabour,
    index?: number
  ): FormGroup {
    return this.fb.group({
      eor_or_surveyor: [
        { value: labourData?.eor_or_surveyor || 'EOR', disabled: index === 0 },
        Validators.required,
      ],
      painting_cost: [
        {
          value: parseFloat(labourData?.painting_cost || '0'),
          disabled: index === 0,
        },
        [Validators.required, Validators.min(0)],
      ],
      painting_materiels: [
        {
          value: parseFloat(labourData?.painting_materiels || '0'),
          disabled: index === 0,
        },
        [Validators.required, Validators.min(0)],
      ],
      sundries: [
        {
          value: parseFloat(labourData?.sundries || '0'),
          disabled: index === 0,
        },
        [Validators.required, Validators.min(0)],
      ],
      num_of_repaire_days: [
        { value: labourData?.num_of_repaire_days || 0, disabled: index === 0 },
        [Validators.required, Validators.min(1)],
      ],
      discount_add_labour: [
        {
          value: parseFloat(labourData?.discount_add_labour || '0'),
          disabled: index === 0,
        },
        [Validators.min(0)],
      ],
      vat: [
        { value: parseFloat(labourData?.vat || '15'), disabled: index === 0 },
        [Validators.min(0), Validators.max(100)],
      ],
      add_labour_total: [
        {
          value: parseFloat(labourData?.add_labour_total || '0'),
          disabled: true,
        },
      ],
    });
  }

  get additionalLabourDetails(): FormArray {
    return this.repairForm.get('additional_labour_details') as FormArray;
  }

  calculatePartTotal(partIndex: number, detailIndex: number): void {
    const partGroup = this.spareParts.at(partIndex) as FormGroup;
    const partDetails = (partGroup.get('part_details') as FormArray).at(
      detailIndex
    ) as FormGroup;

    const cost = parseFloat(partDetails.get('cost_part')?.value || '0');
    const discount = parseFloat(partDetails.get('discount_part')?.value || '0');
    const vatPercent = parseFloat(partDetails.get('vat_part')?.value || '0');

    const subtotal = cost - discount;
    const vat = (subtotal * vatPercent) / 100;
    const total = subtotal + vat;

    partDetails
      .get('part_total')
      ?.setValue(total.toFixed(2), { emitEvent: false });
  }

  calculateLabourTotal(partIndex: number, labourIndex: number): void {
    const partGroup = this.spareParts.at(partIndex) as FormGroup;
    const labourDetails = (partGroup.get('labour_details') as FormArray).at(
      labourIndex
    ) as FormGroup;

    const hours = parseFloat(
      labourDetails.get('number_of_hours')?.value || '0'
    );
    const hourlyCost = parseFloat(
      labourDetails.get('hourly_cost_labour')?.value || '0'
    );
    const discount = parseFloat(
      labourDetails.get('discount_labour')?.value || '0'
    );
    const vatPercent = parseFloat(
      labourDetails.get('vat_labour')?.value || '0'
    );

    const subtotal = hours * hourlyCost - discount;
    const vat = (subtotal * vatPercent) / 100;
    const total = subtotal + vat;

    labourDetails
      .get('labour_total')
      ?.setValue(total.toFixed(2), { emitEvent: false });
  }

  getGrandTotal(): number {
    const partsTotal = this.getTotalPartsCost();
    const labourTotal = this.getTotalLabourCost();
    const additionalLabour = this.getTotalAdditionalLabourCost();

    return partsTotal + labourTotal + additionalLabour;
  }

  calculateAdditionalLabourTotal(index: number): void {
    const labourGroup = this.additionalLabourDetails.at(index) as FormGroup;

    const paintingCost = parseFloat(
      labourGroup.get('painting_cost')?.value || '0'
    );
    const paintingMaterials = parseFloat(
      labourGroup.get('painting_materiels')?.value || '0'
    );
    const sundries = parseFloat(labourGroup.get('sundries')?.value || '0');
    const discount = parseFloat(
      labourGroup.get('discount_add_labour')?.value || '0'
    );
    const vatPercent = parseFloat(labourGroup.get('vat')?.value || '0');

    // Calcul du total
    const subtotal = paintingCost + paintingMaterials + sundries;
    const afterDiscount = subtotal - discount;
    const vatAmount = (afterDiscount * vatPercent) / 100;
    const total = afterDiscount + vatAmount;

    labourGroup
      .get('add_labour_total')
      ?.setValue(total.toFixed(2), { emitEvent: false });
  }

  isFieldInvalid(
    fieldPath: string,
    partIndex: number,
    detailIndex: number
  ): boolean {
    const partDetails = this.getPartDetails(partIndex);
    const detail = partDetails.at(detailIndex);
    const field = detail.get(fieldPath);
    return !!(
      field &&
      field.invalid &&
      (field.touched || this.formSubmittedAttempt)
    );
  }

  isLabourFieldInvalid(
    fieldPath: string,
    partIndex: number,
    labourIndex: number
  ): boolean {
    const labourDetails = this.getLabourDetails(partIndex);
    const detail = labourDetails.at(labourIndex);
    const field = detail.get(fieldPath);
    return !!(
      field &&
      field.invalid &&
      (field.touched || this.formSubmittedAttempt)
    );
  }

  addSparePart(): void {
    const newPart: SparePart = {
      name: '',
      quantity: 1,
      part_details: [
        {
          part_detail_id: 0,
          isSelected: false,
          supplier: '',
          quality: '',
          cost_part: 0,
          discount_part: '0',
          vat_part: '',
          part_total: '0',
        },
      ],
      labour_details: [
        {
          part_detail_id: 0,
          eor_or_surveyor: 'EOR',
          activity: '',
          number_of_hours: '0',
          hourly_cost_labour: '0',
          discount_labour: '0',
          vat_labour: '15',
          labour_total: '0',
        },
      ],
    };

    this.spareParts.push(this.createSparePart(newPart));
  }

  removeSparePart(index: number): void {
    this.spareParts.removeAt(index);
  }

  setActiveTab(tabIndex: number, partIndex: number): void {
    this.activeTabs.set(partIndex, tabIndex);
  }

  getActiveTab(partIndex: number): number {
    return this.activeTabs.get(partIndex) || 0; // Retourne 0 par défaut
  }

  async submitForm(): Promise<boolean> {
    this.formSubmittedAttempt = true;

    if (this.repairForm.invalid) {
      this.markAllAsTouched();
      console.error('Repair form is invalid');

      // Scroll to first invalid field
      const firstInvalidField = document.querySelector('.ng-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      return false;
    }

    const formValue = this.getFormValue();

    // Emit the form values to parent component
    this.formSubmitted.emit(formValue);

    try {
      // Simulate API call
      // await this.claimService.updateRepairInfo(formValue).toPromise();
      return true;
    } catch (error) {
      console.error('Error submitting repair form:', error);
      return false;
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.repairForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  private getFormValue(): any {
    // Transformer les spareParts en format demandé
    const parts = this.spareParts.controls
      .filter((partGroup) => partGroup.get('isSelected')?.value) // ← filtrer ici
      .flatMap((partGroup, partIndex) => {
        const partName = partGroup.get('name')?.value;
        const quantity = partGroup.get('quantity')?.value;
        const partDetailsArray = partGroup.get('part_details') as FormArray;

        return partDetailsArray.controls
          .filter((detailGroup) => {
            const supplier = detailGroup.get('supplier')?.value;
            return supplier && supplier.trim() !== '';
          })
          .map((detailGroup) => ({
            partName: partName,
            quantity: quantity,
            supplier: detailGroup.get('supplier')?.value,
            quality: detailGroup.get('quality')?.value,
            costPart: parseFloat(detailGroup.get('cost_part')?.value || '0'),
            discountPart: parseFloat(
              detailGroup.get('discount_part')?.value || '0'
            ),
            vatPart: parseFloat(detailGroup.get('vat_part')?.value || '0'),
            partTotal: parseFloat(detailGroup.get('part_total')?.value || '0'),
          }));
      });

    // Transformer les labour_details en format demandé
    const labours = this.spareParts.controls
      .filter((partGroup) => partGroup.get('isSelected')?.value) // ← filtrer ici
      .flatMap((partGroup, partIndex) => {
        const labourDetailsArray = partGroup.get('labour_details') as FormArray;

        return labourDetailsArray.controls
          .filter((labourGroup) => {
            const activity = labourGroup.get('activity')?.value;
            return activity && activity.trim() !== '';
          })
          .map((labourGroup) => ({
            eorOrSurveyor: labourGroup.get('eor_or_surveyor')?.value,
            activity: labourGroup.get('activity')?.value,
            numberOfHours: parseFloat(
              labourGroup.get('number_of_hours')?.value || '0'
            ),
            hourlyConstLabour: parseFloat(
              labourGroup.get('hourly_cost_labour')?.value || '0'
            ),
            discountLabour: parseFloat(
              labourGroup.get('discount_labour')?.value || '0'
            ),
            vatLabour: parseFloat(labourGroup.get('vat_labour')?.value || '0'),
            labourTotal: parseFloat(
              labourGroup.get('labour_total')?.value || '0'
            ),
          }));
      });

    // Transformer additional_labour_details en format demandé
    const additional_labour_details = this.additionalLabourDetails.controls.map(
      (labourGroup) => ({
        eorOrSurveyor: labourGroup.get('eor_or_surveyor')?.value,
        paintingCost: labourGroup.get('painting_cost')?.value,
        paintingMateriels: labourGroup.get('painting_materiels')?.value,
        sundries: labourGroup.get('sundries')?.value,
        numOfRepaireDays: labourGroup.get('num_of_repaire_days')?.value,
        discountAddLabour: labourGroup.get('discount_add_labour')?.value,
        vat: labourGroup.get('vat')?.value,
        addLabourTotal: labourGroup.get('add_labour_total')?.value,
      })
    );

    return {
      parts: parts,
      labours: labours,
      additionalLabours: additional_labour_details,
      remarks: this.repairForm.get('remarks')?.value,
      totalPartsCost: this.getTotalPartsCost(),
      totalLabourCost: this.getTotalLabourCost(),
      additionalLabourTotal: this.getTotalAdditionalLabourCost(),
      grandTotal: this.getGrandTotal(),
    };
  }

  getTotalPartsCost(): number {
    return this.spareParts.controls.reduce((total, partGroup) => {
      const partDetailsArray = partGroup.get('part_details') as FormArray;
      return (
        total +
        partDetailsArray.controls.reduce((subtotal, detailGroup) => {
          return (
            subtotal + parseFloat(detailGroup.get('part_total')?.value || '0')
          );
        }, 0)
      );
    }, 0);
  }

  getTotalLabourCost(): number {
    return this.spareParts.controls.reduce((total, partGroup) => {
      const labourDetailsArray = partGroup.get('labour_details') as FormArray;
      return (
        total +
        labourDetailsArray.controls.reduce((subtotal, labourGroup) => {
          return (
            subtotal + parseFloat(labourGroup.get('labour_total')?.value || '0')
          );
        }, 0)
      );
    }, 0);
  }

  getPartDetails(i: number): FormArray {
    return this.spareParts.at(i).get('part_details') as FormArray;
  }

  getLabourDetails(i: number): FormArray {
    return this.spareParts.at(i).get('labour_details') as FormArray;
  }

  addPartDetail(i: number) {
    this.getPartDetails(i).push(
      this.fb.group({
        supplier: ['', Validators.required],
        quality: ['', Validators.required],
        cost_part: [0, [Validators.required, Validators.min(0)]],
        discount_part: ['0', [Validators.min(0)]],
        vat_part: ['15', [Validators.min(0), Validators.max(100)]],
        part_total: ['0'],
      })
    );
  }

  removePartDetail(i: number, j: number) {
    this.getPartDetails(i).removeAt(j);
  }

  addLabourDetail(i: number) {
    this.getLabourDetails(i).push(
      this.fb.group({
        eor_or_surveyor: ['EOR', Validators.required],
        activity: ['', Validators.required],
        number_of_hours: ['0', [Validators.required, Validators.min(0)]],
        hourly_cost_labour: ['0', [Validators.required, Validators.min(0)]],
        discount_labour: ['0', [Validators.min(0)]],
        vat_labour: ['15', [Validators.min(0), Validators.max(100)]],
        labour_total: ['0'],
      })
    );
  }

  removeLabourDetail(i: number, k: number) {
    this.getLabourDetails(i).removeAt(k);
  }

  onSelectPart(partIndex: number, selectedIndex: number) {
    const partDetails = this.getPartDetails(partIndex);

    partDetails.controls.forEach((ctrl, i) => {
      // Utilisez setValue avec emitEvent: false pour éviter les boucles infinies
      ctrl.get('isSelected')?.setValue(i === selectedIndex, {
        emitEvent: false,
        onlySelf: true,
      });
    });

    // Force la détection des changements
    partDetails.updateValueAndValidity();
  }
  get additionalLaboursArray(): FormArray {
    return this.repairForm.get('additional_labour_details') as FormArray;
  }

  addAdditionalLabour(): void {
    this.additionalLaboursArray.push(
      this.fb.group({
        eorOrSurveyor: ['EOR', Validators.required],
        paintingCost: [0, [Validators.required, Validators.min(0)]],
        paintingMaterials: [0, [Validators.required, Validators.min(0)]],
        sundries: [0, [Validators.required, Validators.min(0)]],
        repairDays: [0, [Validators.required, Validators.min(1)]],
        discountPercent: [0, [Validators.min(0), Validators.max(100)]],
        vatPercent: [15, [Validators.min(0), Validators.max(100)]],
      })
    );
  }

  removeAdditionalLabour(index: number): void {
    this.additionalLaboursArray.removeAt(index);
  }

  startEditing(partIndex: number) {
    this.editingPartIndex = partIndex;
    this.editMode = 'name';
  }

  startEditingQuantity(partIndex: number) {
    this.editingPartIndex = partIndex;
    this.editMode = 'quantity';
  }

  saveEditing(partIndex: number) {
    // Valider les données
    const partGroup = this.spareParts.at(partIndex) as FormGroup;

    if (this.editMode === 'name' && !partGroup.get('name')?.value?.trim()) {
      // Nom vide, annuler
      this.cancelEditing();
      return;
    }

    if (this.editMode === 'quantity' && partGroup.get('quantity')?.value < 1) {
      // Quantité invalide, réinitialiser à 1
      partGroup.get('quantity')?.setValue(1);
    }

    // Sauvegarder et quitter le mode édition
    this.editingPartIndex = null;
    this.editMode = null;
  }

  cancelEditing() {
    // Réinitialiser sans sauvegarder
    this.editingPartIndex = null;
    this.editMode = null;
  }

  toggleEditMode(mode: 'name' | 'quantity') {
    if (this.editingPartIndex !== null) {
      this.editMode = mode;
    }
  }

  getTotalAdditionalLabourCost(): number {
    return this.additionalLabourDetails.controls.reduce(
      (total, labourGroup) => {
        return (
          total + parseFloat(labourGroup.get('add_labour_total')?.value || '0')
        );
      },
      0
    );
  }

  calculateAdditionalLabourTotalPerItem(index: number): void {
    const labourGroup = this.additionalLabourDetails.at(index) as FormGroup;

    const paintingCost = parseFloat(
      labourGroup.get('painting_cost')?.value || '0'
    );
    const paintingMaterials = parseFloat(
      labourGroup.get('painting_materiels')?.value || '0'
    );
    const sundries = parseFloat(labourGroup.get('sundries')?.value || '0');
    const discount = parseFloat(
      labourGroup.get('discount_add_labour')?.value || '0'
    );
    const vatPercent = parseFloat(labourGroup.get('vat')?.value || '0');

    // Calcul du total
    const subtotal = paintingCost + paintingMaterials + sundries;
    const afterDiscount = subtotal - discount;
    const vatAmount = (afterDiscount * vatPercent) / 100;
    const total = afterDiscount + vatAmount;

    labourGroup
      .get('add_labour_total')
      ?.setValue(total.toFixed(2), { emitEvent: false });
  }
}
